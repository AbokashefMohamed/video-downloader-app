import path from "path";

// stored before streaming to browser
export const TEMP_DIR = path.join(process.cwd(), "tmp_downloads");

// how long ytdlp has to finish before kill it 
export const DOWNLOAD_TIMEOUT_MS = 30 * 60 * 1000;

// allowed audio formats the user can pick
export const ALLOWED_AUDIO_FORMATS = ["mp3", "m4a", "wav"];


// path to ytdlp binary
export const YTDLP_PATH = process.env.YTDLP_PATH || "./bin/yt-dlp.exe";

// path to ffmpeg binary ffmpeg static gives us the exact path
export const FFMPEG_PATH = process.env.FFMPEG_PATH || (
  await import("ffmpeg-static").then(m => m.default)
)