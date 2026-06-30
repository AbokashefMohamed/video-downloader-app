export const YTDLP_PATH = process.env.YTDLP_PATH || "./bin/yt-dlp.exe";
export const PROBE_TIMEOUT_MS = Number(process.env.PROBE_TIMEOUT_MS) || 30000;
export const KILL_GRACE_MS = 5000;
export const MAX_BUFFER_BYTES = 10 * 1024 * 1024;
export const MAX_URL_LENGTH = 2048;
export const ALLOWED_PROTOCOLS = ["http:", "https:"];
