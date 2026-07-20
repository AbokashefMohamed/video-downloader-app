import { useTranslation } from "react-i18next";

// the three download types the user can choose from
const DOWNLOAD_TYPES = [
  { value: "video", labelKey: "home.downloadVideo", icon: "🎬", descKey: "home.downloadVideoDesc" },
  { value: "audio", labelKey: "home.downloadAudio", icon: "🎵", descKey: "home.downloadAudioDesc" },
  { value: "subtitle", labelKey: "home.downloadSubtitle", icon: "💬", descKey: "home.downloadSubtitleDesc" },
] as const;

export type DownloadType = typeof DOWNLOAD_TYPES[number]["value"];

interface Props {
  value: DownloadType;
  onChange: (value: DownloadType) => void;
}

export function DownloadTypeSelector({ value, onChange }: Props) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2">
  {DOWNLOAD_TYPES.map((dt) => (
    <button
      key={dt.value}
      onClick={() => onChange(dt.value)}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
        value === dt.value
          ? "bg-white text-purple-600 border-white font-semibold"
          : "border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5"
      }`}
    >
      <span className="text-xl">{dt.icon}</span>
      <span className="text-xs">{t(dt.labelKey)}</span>
    </button>
  ))}
</div>
  );
}