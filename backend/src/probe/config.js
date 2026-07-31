// detect operating system — determines which binary to use
const IS_WINDOWS = process.platform === "win32";
const BINARY_NAME = IS_WINDOWS ? "yt-dlp.exe" : "yt-dlp";

// on Linux/Docker — yt-dlp installed via pip, available as system command
// on Windows — use local bin folder
export const YTDLP_PATH = process.env.YTDLP_PATH || (
  IS_WINDOWS ? `./bin/${BINARY_NAME}` : "yt-dlp"
);

// probe timeout — 60 seconds to handle slow connections
export const PROBE_TIMEOUT_MS = Number(process.env.PROBE_TIMEOUT_MS) || 60000;

// grace period before force killing yt-dlp
export const KILL_GRACE_MS = 5000;

// max output buffer — prevents memory exhaustion attacks
export const MAX_BUFFER_BYTES = 10 * 1024 * 1024;

// max URL length — basic input validation
export const MAX_URL_LENGTH = 2048;

// only allow http and https protocols — blocks file://, ftp:// etc.
export const ALLOWED_PROTOCOLS = ["http:", "https:"];