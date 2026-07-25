import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16">
      {/* links section above copyright */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/"
            className="text-white/50 hover:text-white transition-colors text-sm"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/copyright"
            className="text-white/50 hover:text-white transition-colors text-sm"
          >
            {t("footer.copyright", "Copyright")}
          </Link>
          <Link
            to="/terms"
            className="text-white/50 hover:text-white transition-colors text-sm"
          >
            {t("footer.terms", "Terms of Use")}
          </Link>
        </div>
      </div>

      {/* copyright line */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <span className="text-white/40 text-sm">
            <span className="text-white/40 text-sm"> </span>© {currentYear}{" "}
            <span className="text-white/70 text-sm"> VideoDL. </span>{" "}
            {"All rights reserved"}
          </span>
        </div>
      </div>
    </footer>
  );
}
