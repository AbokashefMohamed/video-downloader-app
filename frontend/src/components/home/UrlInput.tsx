import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface Props {
  url: string;
  probing: boolean;
  onChange: (url: string) => void;
  onProbe: () => void;
}

export function UrlInput({ url, probing, onChange, onProbe }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <input
        type="url"
        required
        autoComplete="off"
        spellCheck={false}
        value={url}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && url.trim()) {
            onProbe();
          }
        }}
        placeholder={t("home.urlPlaceholder")}
        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
      />
      <Button
        onClick={onProbe}
        disabled={probing || !url.trim()}
        className="bg-white text-purple-600 hover:bg-white/90 shrink-0"
      >
        {probing ? t("common.loading") : t("home.probeButton")}
      </Button>
    </div>
  );
}
