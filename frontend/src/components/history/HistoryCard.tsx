import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HistoryEntry } from "../../types";
import { Button } from "../ui/button";
import { formatDate } from "../../utils";

interface Props {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
}

export function HistoryCard({ entry, onDelete }: Props) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const handleClear = () => {
    // Validation: Safeguard against missing identifiers
    if (entry._id) {
      onDelete(entry._id);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex gap-4 items-start">
      {/* thumbnail with image failure validation */}
      {entry.thumbnail && !imageError ? (
        <img
          src={entry.thumbnail}
          alt={entry.title ?? "History item thumbnail"}
          onError={() => setImageError(true)} // Gracefully handles broken asset URLs
          className="w-24 h-16 object-cover rounded-lg shrink-0"
        />
      ) : (
        <div className="w-24 h-16 bg-white/10 rounded-lg shrink-0 flex items-center justify-center">
          <span className="text-white/30 text-xs">
            {imageError
              ? t("history.imageError", "No image")
              : t("history.noImage", "No image")}
          </span>
        </div>
      )}

      {/* info */}
      <div className="flex-1 min-w-0">
        {/* Added native HTML title attribute so users can view the full string on hover if truncated */}
        <p
          className="text-white font-medium truncate"
          title={entry.title ?? entry.url}
        >
          {entry.title ?? entry.url}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
            {t(`history.${entry.type}`)}
          </span>
          {entry.quality && (
            <span className="text-xs text-white/50">{entry.quality}</span>
          )}
          {entry.audioFormat && (
            <span className="text-xs text-white/50 uppercase">
              {entry.audioFormat}
            </span>
          )}
        </div>
        <p className="text-white/40 text-xs mt-1">
          {formatDate(entry.createdAt)}
        </p>
      </div>

      {/* delete button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleClear}
        disabled={!entry._id} // Validation: Disable interactive buttons if backend identifier is missing
        className="border-red-400/30 text-red-300 hover:bg-red-500/10 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("history.delete")}
      </Button>
    </div>
  );
}
