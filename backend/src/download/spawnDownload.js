import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { YTDLP_PATH, TEMP_DIR, DOWNLOAD_TIMEOUT_MS } from "./config.js";
import { buildArgs } from "./buildArgs.js";

// creates tmp_downloads folder if it doesn't exist yet
function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

// deletes a file silently used for cleanup after streaming
function safeRemove(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (_) {}
}

// find actual output file ytdlp created
function findOutputFile(dir, uniqueId, type) {
  const files = fs.readdirSync(dir);
  const matches = files.filter((f) => f.includes(uniqueId));

  if (type === "video") {
    // mp4 is the merged final file
    return (
      matches.find((f) => f.endsWith(".mp4")) ||
      matches.find((f) => f.endsWith(".mkv")) ||
      matches[0] ||
      null
    );
  }

  if (type === "audio") {
    // prefer requisted format
    return (
      matches.find((f) => f.endsWith(".mp3")) ||
      matches.find((f) => f.endsWith(".m4a")) ||
      matches.find((f) => f.endsWith(".wav")) ||
      matches[0] ||
      null
    );
  }

  if (type === "subtitle") {
    return matches.find((f) => f.endsWith(".srt")) || matches[0] || null;
  }
  return matches[0] || null;
}

// runs ytdlp and streams the finished file to browser
export async function spawnDownload({
  type,
  url,
  formatId,
  audioFormat,
  subLang,
  playlistEnd,
  res,
}) {
  ensureTempDir();

  // unique suffix prevents collisions when two downloads run at the same time
  const uniqueId = Date.now().toString(36);
  const outputTemplate = path.join(TEMP_DIR, `%(title)s_${uniqueId}.%(ext)s`);

  const args = buildArgs({
    type,
    url,
    outputPath: outputTemplate,
    formatId,
    audioFormat,
    subLang,
    playlistEnd,
  });

  return new Promise((resolve, reject) => {
    const child = spawn(YTDLP_PATH, args, { shell: false });

    let stderr = "";
    let settled = false;
    let progressPercent = 0;

    // kill ytdlp if takes long time to prevents hung processes
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000);
      if (!settled) {
        settled = true;
        reject(new Error("download time out"));
      }
    }, DOWNLOAD_TIMEOUT_MS);

    // parse progress precentage from ytdlp output linees
    child.stdout.on("data", (chunk) => {
      const line = chunk.toString();

      // ytdlp prints line download precentage
      const match = line.match(/(\d+\.?\d*)%/);
      if (match) {
        progressPercent = parseFloat(match[1]);
      }
    });
    // collect stderr separately
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    // fires if ytdlp binary couldn't start at all
    child.on("error", (err) => {
      clearTimeout(timeout);
      if (!settled) {
        settled = true;
        reject(new Error(`Failed to start yt-dlp: ${err.message}`));
      }
    });
    // fires when ytdlp fully exits
    child.on("close", (exitCode) => {
      clearTimeout(timeout);
      if (settled) return;
      settled = true;

      if (exitCode !== 0) {
        console.error("[download] yt-dlp stderr:", stderr.slice(0, 2000));
        return reject(new Error("yt-dlp download failed"));
      }

      // small delay to gives the filesystem time to finish renaming
      setTimeout(() => {
        const fileName = findOutputFile(TEMP_DIR, uniqueId, type);
        if (!fileName) {
          return reject(new Error("Downloaded file not found"));
        }

        const filePath = path.join(TEMP_DIR, fileName);
        const fileSize = fs.statSync(filePath).size;

        // strip the uniqueId suffix so the user gets a clean filename
        const cleanName = fileName.replace(`_${uniqueId}`, "");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${cleanName}"`,
        );
        res.setHeader("Content-Length", fileSize);
        res.setHeader("Content-Type", "application/octet-stream");

        const readStream = fs.createReadStream(filePath);

        readStream.on("error", (err) => {
          // clean up all temp files for this download on error
          const allFiles = fs.readdirSync(TEMP_DIR);
          allFiles
            .filter((f) => f.includes(uniqueId))
            .forEach((f) => safeRemove(path.join(TEMP_DIR, f)));
          reject(err);
        });

        readStream.on("close", () => {
          // file fully sent so delete all temp files for this download
          const allFiles = fs.readdirSync(TEMP_DIR);
          allFiles
            .filter((f) => f.includes(uniqueId))
            .forEach((f) => safeRemove(path.join(TEMP_DIR, f)));
          resolve({ progressPercent });
        });
        // pipe streams the file chunk by chunk directly to the browser
        readStream.pipe(res);
      }, 1000);
    });
  });
}
