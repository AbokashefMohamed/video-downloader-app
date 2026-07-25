import { spawn } from "child_process";
import { YTDLP_PATH } from "./config.js";

export function spawnYtDlp(url, noPlaylist) {
  const args = [
    "--dump-json",
    "--no-warnings",
    "--extractor-args", "youtube:player_client=web",
    "--js-runtime", `nodejs:${process.execPath}`,
    ...(noPlaylist ? ["--no-playlist"] : []),
    url,
  ];
  return spawn(YTDLP_PATH, args, { shell: false });
}