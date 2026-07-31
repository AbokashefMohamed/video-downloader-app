import path from "path";

// detect operating system — determines which binaries to use
const IS_WINDOWS = process.platform === "win32";
const BINARY_NAME = IS_WINDOWS ? "yt-dlp.exe" : "yt-dlp";

// where finished files are temporarily stored before streaming to browser
export const TEMP_DIR = path.join(process.cwd(), "tmp_downloads");

// how long yt-dlp has to finish before we kill it (30 minutes)
export const DOWNLOAD_TIMEOUT_MS = 30 * 60 * 1000;

// audio formats the user can pick from
export const ALLOWED_AUDIO_FORMATS = ["mp3", "m4a", "wav"];

// on Linux/Docker — yt-dlp installed via pip, available as system command
// on Windows — use local bin folder
export const YTDLP_PATH = process.env.YTDLP_PATH || (
  IS_WINDOWS ? `./bin/${BINARY_NAME}` : "yt-dlp"
);

// on Linux/Docker — ffmpeg installed via apt, available as system command
// on Windows — use ffmpeg-static package
export const FFMPEG_PATH = process.env.FFMPEG_PATH || (
  IS_WINDOWS
    ? (await import("ffmpeg-static").then(m => m.default))
    : "ffmpeg"
);