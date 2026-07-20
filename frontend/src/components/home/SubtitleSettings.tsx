import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Subtitle } from "../../types";

interface Props {
  subtitles: Subtitle[];
  subLang: string | null;
  onChange: (lang: string | null) => void;
}

export function SubtitleSettings({ subtitles, subLang, onChange }: Props) {
  const { t } = useTranslation();

  // separate real subtitles from auto-generated ones
  const realSubs = subtitles.filter((s) => !s.isAuto);
  const autoSubs = subtitles.filter((s) => s.isAuto);

  const selectedSubtitle = subtitles.some((s) => s.lang === subLang)
  ? subLang
  : "";

  if (subtitles.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 [&_svg]:text-white">
      <label className="text-white/80 text-sm">
        {t("home.selectSubtitle")}
      </label>
      <Select
        value={selectedSubtitle}
        onValueChange={(v) => onChange(v || null)}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
          <SelectValue className="text-white" placeholder={t("home.selectSubtitle")} />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {/* real subtitles first */}
          {realSubs.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-white font-medium">
                Subtitles
              </div>
              {realSubs.map((s) => (
                <SelectItem key={s.lang} value={s.lang}>
                  {s.name}
                </SelectItem>
              ))}
            </>
          )}

          {/* auto-generated subtitles */}
          {autoSubs.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-white font-medium mt-1">
                Auto-generated
              </div>
              {autoSubs.map((s) => (
                <SelectItem key={`auto-${s.lang}`} value={s.lang}>
                  {s.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}