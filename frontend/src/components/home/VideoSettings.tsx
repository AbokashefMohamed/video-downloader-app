import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { VideoFormat } from "../../types";

interface Props {
  formats: VideoFormat[];
  formatId: string | null;
  onChange: (formatId: string | null) => void;
}

export function VideoSettings({ formats, formatId, onChange }: Props) {
  const { t } = useTranslation();

  // only show formats that have a real resolution (not audio-only streams)
  const videoFormats = formats.filter((f) => f.resolution !== null);

  const selectedFormat =
  videoFormats.some((f) => f.formatId === formatId)
    ? formatId
    : "";
  if (videoFormats.length === 0) return null;


  return (
    <div className="flex flex-col gap-1">
      <label className="text-white/80 text-sm">{t("home.selectQuality")}</label>
      <Select
        value={selectedFormat}
        onValueChange={(v) => onChange(v || null)}
      >
        <SelectTrigger className="bg-white border-white/20 text-white">
          <SelectValue className="text-purple-600" placeholder={t("home.selectQuality")} />
        </SelectTrigger>
        <SelectContent className="w-auto min-w-full max-w-sm">
          {videoFormats.map((f) => (
            <SelectItem key={f.formatId} value={f.formatId}>
              {f.resolution} — {f.ext}
              {f.filesize
                ? ` (${(f.filesize / 1024 / 1024).toFixed(1)}MB)`
                : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}