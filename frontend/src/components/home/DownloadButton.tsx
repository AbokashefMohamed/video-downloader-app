import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { DownloadType } from "./DownloadTypeSelector";

interface Props {
  type: DownloadType;
  isPlaylist: boolean;
  downloading: boolean;
  disabled: boolean;
  isAuthenticated: boolean;
  downloadProgress: number;
  onPlaylistChange: (value: boolean) => void;
  onDownload: () => void;
}

export function DownloadButton({
  type,
  isPlaylist,
  downloading,
  disabled,
  isAuthenticated,
  downloadProgress,
  onPlaylistChange,
  onDownload,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPlaylist}
          onChange={(e) => onPlaylistChange(e.target.checked)}
          className="w-4 h-4 accent-purple-400"
        />
        <span className="text-white/80 text-sm">{t("home.isPlaylist")}</span>
      </label>

      {!isAuthenticated && (
        <p className="text-yellow-300/80 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          ⚠ {t("home.loginForMore")}
        </p>
      )}

      {/* progress bar */}
      {/* progress bar */}
      {downloading && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-white/60 text-xs">
            <span>
              {downloadProgress > 0
                ? "Downloading to your device..."
                : "⏳ Processing on server..."}
            </span>
            <span>{downloadProgress > 0 ? `${downloadProgress}%` : ""}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-violet-500 via-fuchsia-400 via-pink-400 to-amber-400 animate-gradient relative overflow-hidden"
              style={{ width: `${downloadProgress}%` }}
            >
              {/* shimmer shine effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{ animation: "shimmer 1.5s infinite" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* download button — shows static text, no percentage */}
      <Button
        onClick={onDownload}
        disabled={downloading || disabled}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3"
      >
        {downloading
          ? t("common.loading")
          : t(`home.download${type.charAt(0).toUpperCase() + type.slice(1)}`)}
      </Button>
    </div>
  );
}
