import fs from "fs";
import path from "path";
import https from "https";

const BIN_DIR = path.join(process.cwd(), "bin");
const IS_WINDOWS = process.platform === "win32";
const BINARY_NAME = IS_WINDOWS ? "yt-dlp.exe" : "yt-dlp";
const YTDLP_PATH = path.join(BIN_DIR, BINARY_NAME);

// correct download URL based on platform
const DOWNLOAD_URL = IS_WINDOWS
  ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"
  : "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";

const MAX_REDIRECTS = 5;

function ensureBinDir() {
  if (!fs.existsSync(BIN_DIR)) {
    fs.mkdirSync(BIN_DIR, { recursive: true });
  }
}

function safeRemove(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (_) {}
}

function downloadFile(url, destination, redirectCount = 0) {
  if (redirectCount > MAX_REDIRECTS) {
    return Promise.reject(new Error("Too many redirects"));
  }
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (res) => {
        const { statusCode, headers } = res;
        if (statusCode === 302 || statusCode === 301) {
          file.close();
          safeRemove(destination);
          return downloadFile(headers.location, destination, redirectCount + 1)
            .then(resolve)
            .catch(reject);
        }
        if (statusCode !== 200) {
          file.close();
          safeRemove(destination);
          return reject(
            new Error(`Download failed with status: ${statusCode}`),
          );
        }
        res.pipe(file);
        file.on("close", resolve);
      })
      .on("error", (err) => {
        file.close();
        safeRemove(destination);
        reject(err);
      });
  });
}

async function setup() {
  if (fs.existsSync(YTDLP_PATH)) {
    console.log(`${BINARY_NAME} already exists, skipping download`);
    return;
  }

  ensureBinDir();
  console.log(`Downloading ${BINARY_NAME} for ${process.platform}...`);

  try {
    await downloadFile(DOWNLOAD_URL, YTDLP_PATH);

    // on Linux/Mac, make the binary executable
    if (!IS_WINDOWS) {
      fs.chmodSync(YTDLP_PATH, "755");
      console.log(`Set executable permissions on ${BINARY_NAME}`);
    }

    console.log(`✓ ${BINARY_NAME} downloaded successfully`);
  } catch (error) {
    console.error(`✗ Failed to download ${BINARY_NAME}:`, error.message);
    process.exit(1);
  }
  // install curl-cffi for impersonation support on Linux
  if (!IS_WINDOWS) {
    try {
      console.log("Installing curl_cffi...");
      const { execSync } = await import("child_process");
      execSync(
        "pip3 install curl_cffi --break-system-packages 2>&1 || pip install curl_cffi --break-system-packages 2>&1 || true",
        {
          stdio: "inherit",
          timeout: 120000,
        },
      );
      console.log("✓ curl_cffi installed");
    } catch (e) {
      console.log("curl_cffi installation failed:", e.message);
    }
  }
}

setup();
