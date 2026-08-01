import path from "path";
import os from "os";
import fs from "fs";
import { ALLOWED_AUDIO_FORMATS, FFMPEG_PATH } from "./config.js";

function getCookiesArgs() {
  const cookiesBase64 = process.env.YTDLP_COOKIES_BASE64;
  if (!cookiesBase64) return [];
  try {
    const cookiesContent = Buffer.from(cookiesBase64, "base64").toString(
      "utf8",
    );
    const cookiesPath = path.join(os.tmpdir(), "yt-dlp-cookies.txt");
    fs.writeFileSync(cookiesPath, cookiesContent);
    return ["--cookies", cookiesPath];
  } catch {
    return [];
  }
}

// build ytdlp argumant array based on what user wants to download
export function buildArgs({
  type,
  url,
  outputPath,
  formatId,
  audioFormat,
  subLang,
  playlistEnd,
}) {
  const base = [
    "--ffmpeg-location",
    FFMPEG_PATH,
    "--no-warnings",
    "--newline",
    "--impersonate",
    "chrome",
    "--js-runtime",
    `nodejs:${process.execPath}`,
    ...getCookiesArgs(),
    "-o",
    outputPath,
  ];

  // add playlist limit if one was calculated
  if (playlistEnd) {
    base.push("--playlist-end", String(playlistEnd));
  }

  if (type === "video") {
    // if user picked a specific format use it, otherwise default to 480p
    const format = formatId
      ? `${formatId}+bestaudio/best`
      : "bestvideo[height<=480]+bestaudio/best[height<=480]/bestvideo+bestaudio";

    return [...base, "-f", format, "--merge-output-format", "mp4", url];
  }

  if (type === "audio") {
    // validate audio format fall back to mp3 if something invalid was sent
    const format = ALLOWED_AUDIO_FORMATS.includes(audioFormat)
      ? audioFormat
      : "mp3";

    return [
      ...base,
      "-x",
      "--audio-format",
      format,
      "--audio-quality",
      "0",
      url,
    ];
  }

  if (type === "subtitle") {
    return [
      ...base,
      "--write-subs",
      "--write-auto-subs",
      "--sub-lang",
      subLang,
      "--sub-format",
      "srt",
      "--skip-download",
      "--convert-subs",
      "srt",
      url,
    ];
  }

  throw new Error(`Unknown download type: ${type}`);
}
