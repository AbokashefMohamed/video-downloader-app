import { ProbeError } from "./errors.js";

export function parseProbeOutput(stdout, noPlaylist) {
  // yt-dlp prints one line of JSON per video
  const lines = stdout.trim().split("\n").filter(Boolean);
  const entries = lines.map((line) => JSON.parse(line));

  if (entries.length === 0) {
    throw new ProbeError("yt-dlp returned no data", "PARSE_FAILED");
  }

  // single video => one object, playlist=> array of objects
  return noPlaylist ? formatProbeResult(entries[0]) : entries.map(formatProbeResult);
}

function formatProbeResult(result) {
  return {
    title: result.title || "Unknown title",
    thumbnail: result.thumbnail || null,
    duration: result.duration || 0,
    webpage_url: result.webpage_url || result.original_url,
    formats: (result.formats || [])
      .filter((f) => f.ext && f.format_id && f.ext !== "mhtml")
      .map((f) => ({
        formatId: f.format_id,
        ext: f.ext,
        resolution: f.resolution === "audio only" ? null : f.resolution,
        filesize: f.filesize || null,
      })),
    subtitles: [
      ...Object.entries(result.subtitles || {}).map(([lang, tracks]) => ({
        lang,
        name: tracks[0]?.name || lang,
        isAuto: false,
      })),
      ...Object.entries(result.automatic_captions || {}).map(([lang, tracks]) => ({
        lang,
        name: tracks[0]?.name || lang,
        isAuto: true,
      })),
    ],
  };
}