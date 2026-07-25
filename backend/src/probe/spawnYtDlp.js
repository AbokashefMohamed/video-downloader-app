import { spawn } from "child_process";
import { YTDLP_PATH } from "./config.js";

export function spawnYtDlp(url, noPlaylist) {
  const args = [
    "--dump-json",
    "--no-warnings",
    "--js-runtime",
    `nodejs:${process.execPath}`,
    "--no-check-certificates",
    ...(noPlaylist ? ["--no-playlist"] : []),
    url,
  ];
  return spawn(YTDLP_PATH, args, { shell: false });
}
