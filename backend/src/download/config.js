import path from "path";

// detect operating system
const IS_WINDOWS = process.platform === "win32";
const BINARY_NAME = IS_WINDOWS ? "yt-dlp.exe" : "yt-dlp";

// where finished files are temporarily stored before streaming to browser
export const TEMP_DIR = path.join(process.cwd(), "tmp_downloads");

// how long yt-dlp has to finish before we kill it (30 minutes)
export const DOWNLOAD_TIMEOUT_MS = 30 * 60 * 1000;

// audio formats the user can pick from
export const ALLOWED_AUDIO_FORMATS = ["mp3", "m4a", "wav"];

// path to yt-dlp binary uses env variable if set otherwise falls back to local bin folder
export const YTDLP_PATH = process.env.YTDLP_PATH || `./bin/${BINARY_NAME}`;

// path to ffmpeg binaryffmpeg static provides a pre built binary for the current platform
// used by yt-dlp to merge video and audio streams into the final file
export const FFMPEG_PATH = process.env.FFMPEG_PATH || (
  await import("ffmpeg-static").then(m => m.default)
);