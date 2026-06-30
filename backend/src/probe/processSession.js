import { PROBE_TIMEOUT_MS, KILL_GRACE_MS, MAX_BUFFER_BYTES } from "./config.js";
import { ProbeError } from "./errors.js";
import { parseProbeOutput } from "./formatResult.js";

export function createProcessSession(child, resolve, reject, noPlaylist) {
  let stdout = "";      // text yt-dlp prints as normal output
  let stderr = "";      // text yt-dlp prints as error output
  let settled = false;  // tracks whether i already resolved/rejected once

  // If yt-dlp takes too long, kill it and give up
  const timeout = setTimeout(() => {
    child.kill("SIGTERM");                              // ask nicely first
    setTimeout(() => child.kill("SIGKILL"), KILL_GRACE_MS); // force kill if it ignores me 
    settleReject(new ProbeError("yt-dlp timeout", "TIMEOUT"));
  }, PROBE_TIMEOUT_MS);

  // Stop listening and clear the timer call this whenever we're done
  function cleanup() {
    clearTimeout(timeout);
    child.stdout.removeAllListeners();
    child.stderr.removeAllListeners();
  }

  // Helper so i never accidentally resolve/reject twice
  function settleResolve(value) {
    if (settled) return;
    settled = true;
    cleanup();
    resolve(value);
  }

  function settleReject(error) {
    if (settled) return;
    settled = true;
    cleanup();
    reject(error);
  }

  // Called every time yt-dlp prints more normal output
  function appendStdout(chunk) {
    stdout += chunk.toString();
    if (stdout.length > MAX_BUFFER_BYTES) {
      child.kill("SIGKILL");
      settleReject(new ProbeError("yt-dlp output exceeded size limit", "BUFFER_EXCEEDED"));
    }
  }

  // Called every time yt-dlp prints more error output
  function appendStderr(chunk) {
    stderr += chunk.toString();
    if (stderr.length > MAX_BUFFER_BYTES) {
      child.kill("SIGKILL");
      settleReject(new ProbeError("yt-dlp output exceeded size limit", "BUFFER_EXCEEDED"));
    }
  }

  // Called once when yt-dlp finishes running
  function handleClose(exitCode) {
    if (exitCode !== 0) {
      // Don't show the raw error to users just log it for me
      if (stderr) console.error("[probeUrl] yt-dlp stderr:", stderr.slice(0, 2000));
      return settleReject(new ProbeError("yt-dlp probe failed", "EXIT_FAILED"));
    }

    try {
      settleResolve(parseProbeOutput(stdout, noPlaylist));
    } catch (err) {
      settleReject(
        err instanceof ProbeError
          ? err
          : new ProbeError("Failed to parse yt-dlp output as json", "PARSE_FAILED"),
      );
    }
  }

  // Called if yt-dlp couldn't even start (ex. wrong file path)
  function handleSpawnError(err) {
    settleReject(new ProbeError(`failed to start yt-dlp: ${err.message}`, "SPAWN_FAILED"));
  }

  // I hand back these four functions so index.js can wire them
  // up to the actual events on the child process.
  return { appendStdout, appendStderr, handleClose, handleSpawnError };
}