import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { DownloadType } from "./DownloadTypeSelector";

interface Props {
  type: DownloadType;
  isPlaylist: boolean;
  downloading: boolean;
  disabled: boolean;
  isAuthenticated: boolean;
  onPlaylistChange: (value: boolean) => void;
  onDownload: () => void;
}

export function DownloadButton({
  type,
  isPlaylist,
  downloading,
  disabled,
  isAuthenticated,
  onPlaylistChange,
  onDownload,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      {/* playlist toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPlaylist}
          onChange={(e) => onPlaylistChange(e.target.checked)}
          className="w-4 h-4 accent-purple-400"
        />
        <span className="text-white/80 text-sm">{t("home.isPlaylist")}</span>
      </label>

      {/* guest warning */}
      {!isAuthenticated && (
        <p className="text-yellow-300/80 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          ⚠ {t("home.loginForMore")}
        </p>
      )}

      {/* download button */}
      <Button
        onClick={() => {
          if (!downloading && !disabled) {
            onDownload();
          }
        }}
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
