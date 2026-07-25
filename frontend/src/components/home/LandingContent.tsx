import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";

const FEATURES = [
  {
    icon: "🎬",
    titleKey: "landing.feature1Title",
    descKey: "landing.feature1Desc",
  },
  {
    icon: "🎵",
    titleKey: "landing.feature2Title",
    descKey: "landing.feature2Desc",
  },
  {
    icon: "💬",
    titleKey: "landing.feature3Title",
    descKey: "landing.feature3Desc",
  },
  {
    icon: "📋",
    titleKey: "landing.feature4Title",
    descKey: "landing.feature4Desc",
  },
  {
    icon: "📜",
    titleKey: "landing.feature5Title",
    descKey: "landing.feature5Desc",
  },
  {
    icon: "🌍",
    titleKey: "landing.feature6Title",
    descKey: "landing.feature6Desc",
  },
];

const STEPS = [
  {
    number: "01",
    titleKey: "landing.step1Title",
    descKey: "landing.step1Desc",
  },
  {
    number: "02",
    titleKey: "landing.step2Title",
    descKey: "landing.step2Desc",
  },
  {
    number: "03",
    titleKey: "landing.step3Title",
    descKey: "landing.step3Desc",
  },
];

const PLATFORMS = [
  "YouTube",
  "Twitter / X",
  "Instagram",
  "Facebook",
  "TikTok",
  "Vimeo",
  "And more...",
];

export function LandingContent() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="border-t border-white/10 py-6 flex flex-col gap-16 mt-12">
      {/* mini hero */}
      <section className="text-center flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm">
          🆓 {t("landing.freeBadge")}<br></br>
          👤 {t("landing.freeBadgeTwo")}
        </div>
        <h2 className="text-3xl font-bold text-white max-w-2xl">
          {t("landing.heroTitle")}
        </h2>
        <p className="text-white/60 text-sm max-w-lg">
          {t("landing.heroSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="bg-white text-purple-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm"
          >
            {t("landing.startDownloading")}
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="border border-white/30 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              {t("landing.createAccount")}
            </Link>
          )}
        </div>
      </section>

      {/* features */}
      <section className="border-t border-white/10 py-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            {t("landing.featuresTitle")}
          </h2>
          <p className="text-white/50 text-sm">
            {t("landing.featuresSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.titleKey}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col gap-2"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="text-white font-semibold text-sm">
                {t(f.titleKey)}
              </h3>
              <p className="text-white/50 text-xs">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="border-t border-white/10 py-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="text-white/50 text-sm">
            {t("landing.howItWorksSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col gap-3 "
            >
              <span className="text-3xl font-bold text-white/20">
                {step.number}
              </span>
              <h3 className="text-white font-semibold text-sm">
                {t(step.titleKey)}
              </h3>
              <p className="text-white/50 text-xs">{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* supported platforms */}
      <section className="flex flex-col gap-4 text-center border-t border-white/10 py-6">
        <h2 className="text-2xl font-bold text-white">
          {t("landing.platformsTitle")}
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {PLATFORMS.map((platform) => (
            <span
              key={platform}
              className="bg-white/10 border border-white/20 text-white/70 px-3 py-1.5 rounded-full text-sm"
            >
              {platform}
            </span>
          ))}
        </div>
      </section>

      {/* guest CTA */}
      {!isAuthenticated && (
        <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {t("landing.guestLimitTitle")}
            </h2>
            <p className="text-white/60 text-sm">
              {t("landing.guestLimitDesc")}
            </p>
          </div>
          <Link
            to="/register"
            className="bg-white text-purple-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors shrink-0 text-sm"
          >
            {t("landing.registerFree")}
          </Link>
        </section>
      )}

      {/* final CTA */}
      <section className="text-center flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-white">
          {t("landing.ctaTitle")}
        </h2>
        <p className="text-white/60 text-sm max-w-md">{t("landing.ctaDesc")}</p>
        <button
          onClick={() => {
            document
              .getElementById("downloader")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-white text-purple-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm cursor-pointer"
        >
          {t("landing.startDownloading")}
        </button>
      </section>
    </div>
  );
}
