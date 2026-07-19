import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// supported audio formats
const AUDIO_FORMATS = ["mp3", "m4a", "wav"] as const;

export type AudioFormat = typeof AUDIO_FORMATS[number];

interface Props {
  audioFormat: AudioFormat;
  onChange: (format: AudioFormat) => void;
}

export function AudioSettings({ audioFormat, onChange }: Props) {
  const { t } = useTranslation();



  return (
    <div className="flex flex-col gap-1">
      <label className="text-white/80 text-sm">
        {t("home.selectAudioFormat")}
      </label>
      <Select
        value={audioFormat}
        onValueChange={(v) => v && onChange(v)}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {AUDIO_FORMATS.map((f) => (
            <SelectItem key={f} value={f}>
              {f.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}