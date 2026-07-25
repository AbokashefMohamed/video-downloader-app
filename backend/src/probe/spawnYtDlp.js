import { spawn } from "child_process";
import { YTDLP_PATH } from "./config.js";
import fs from "fs";
import path from "path";
import os from "os";

// write cookies to temp file 
function getCookiesArgs() {
  const cookiesBase64 = process.env.YTDLP_COOKIES_BASE64;
  if (!cookiesBase64) return [];
  try {
    const cookiesContent = Buffer.from(cookiesBase64, "base64").toString("utf8");
    const cookiesPath = path.join(os.tmpdir(), "yt-dlp-cookies.txt");
    fs.writeFileSync(cookiesPath, cookiesContent);
    return ["--cookies", cookiesPath];
  } catch {
    return [];
  }
}

export function spawnYtDlp(url, noPlaylist) {
  const args = [
    "--dump-json",
    "--no-warnings",
    "--js-runtime", `nodejs:${process.execPath}`,
    "--no-check-certificates",
    ...getCookiesArgs(),
    ...(noPlaylist ? ["--no-playlist"] : []),
    url,
  ];
  return spawn(YTDLP_PATH, args, { shell: false });
}