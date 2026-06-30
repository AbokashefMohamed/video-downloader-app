import { assertValidUrl } from "./validateUrl.js";
import { spawnYtDlp } from "./spawnYtDlp.js";
import { createProcessSession } from "./processSession.js";

export { ProbeError } from "./errors.js";

/**
 * Probes a video or playlist URL via yt-dlp.
 * @param {string} url
 * @param {{ noPlaylist?: boolean }} [options]
 * @returns {Promise<object|object[]>}
 * @throws {ProbeError}
 */
export function probeUrl(url, { noPlaylist = true } = {}) {
  assertValidUrl(url); // make sure the URL is safe

  return new Promise((resolve, reject) => {
    const child = spawnYtDlp(url, noPlaylist); // start yt-dlp
    const session = createProcessSession(child, resolve, reject, noPlaylist); // step 3: watch it run

    child.stdout.on("data", session.appendStdout);
    child.stderr.on("data", session.appendStderr);
    child.on("close", session.handleClose);
    child.on("error", session.handleSpawnError);
  });
}