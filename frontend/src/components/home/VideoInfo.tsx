import { ProbeResult } from "../../types";

interface Props {
  result: ProbeResult;
}

// formats seconds into mm:ss or hh:mm:ss
function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export function VideoInfo({ result }: Props) {
  return (
    <div className="flex gap-4 items-start">
      {result.thumbnail && (
        <img
          src={result.thumbnail}
          alt={result.title || "Video thumbnail"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="w-32 h-20 object-cover rounded-lg shrink-0"
        />
      )}
      <div>
        <p className="text-white font-medium">{result.title}</p>
        {result.duration > 0 && (
          <p className="text-white/60 text-sm mt-1">
            ⏱ {formatDuration(result.duration)}
          </p>
        )}

        {result.webpage_url && (
          <a
            href={result.webpage_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 text-xs mt-1 block truncate max-w-xs"
          >
            {result.webpage_url}
          </a>
        )}
      </div>
    </div>
  );
}
