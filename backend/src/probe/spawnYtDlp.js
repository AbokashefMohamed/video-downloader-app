import { spawn } from "child_process";
import { YTDLP_PATH } from "./config.js";

export function spawnYtDlp(url, noPlaylist) {
  // I build the command arguments as an ARRAY, not a string.
  // This matters for security: if i built a string like
  // `yt-dlp ${url}`, someone could put shell commands inside the URL
  // and they would actually run on your server. Using an array means
  // the URL is always treated as plain data, never as a command.
  const args = ["--dump-json", ...(noPlaylist ? ["--no-playlist"] : []), url];

  return spawn(YTDLP_PATH, args, { shell: false });
}