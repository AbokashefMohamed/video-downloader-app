import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// the three download types the user can choose from
const DOWNLOAD_TYPES = [
  { value: "video", labelKey: "home.downloadVideo" },
  { value: "audio", labelKey: "home.downloadAudio" },
  { value: "subtitle", labelKey: "home.downloadSubtitle" },
] as const;

export type DownloadType = typeof DOWNLOAD_TYPES[number]["value"];

interface Props {
  value: DownloadType;
  onChange: (value: DownloadType) => void;
}

export function DownloadTypeSelector({ value, onChange }: Props) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-1">
      <label className="text-white/80 text-sm font-medium">
        {t("home.selectType")}
      </label>
      <Select
        value={value}
        onValueChange={(v) => v && onChange(v as DownloadType)}
      >
        <SelectTrigger className="bg-white border-white/20 text-purple-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DOWNLOAD_TYPES.map((dt) => (
            <SelectItem key={dt.value} value={dt.value}>
              {t(dt.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}