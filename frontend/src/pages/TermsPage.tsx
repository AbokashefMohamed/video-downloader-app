import { useTranslation } from "react-i18next";

export function TermsPage() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col gap-6">

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("terms.title", "Terms of Use")}
          </h1>
          <p className="text-white/50 text-sm">
            {t("terms.lastUpdated", "Last updated")}: {currentYear}
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("terms.acceptanceTitle", "Acceptance of Terms")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("terms.acceptanceDesc", "By using VideoDL, you agree to these terms. If you do not agree, please do not use this service.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("terms.useTitle", "Permitted Use")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("terms.useDesc", "You may use VideoDL only for lawful purposes and in accordance with these terms. You agree not to use this service to download copyrighted content without permission, distribute downloaded content commercially, or violate any applicable laws.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("terms.accountTitle", "User Accounts")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("terms.accountDesc", "You are responsible for maintaining the security of your account. You must provide accurate information when registering. We reserve the right to terminate accounts that violate these terms.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("terms.limitsTitle", "Service Limits")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("terms.limitsDesc", "Guest users receive 3 free downloads. Registered users receive unlimited single video downloads and playlist downloads with a 6-hour cooldown. We reserve the right to modify these limits at any time.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("terms.disclaimerTitle", "Disclaimer")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("terms.disclaimerDesc", "VideoDL is provided as-is without any warranties. We are not responsible for how downloaded content is used. Users are solely responsible for complying with all applicable laws and regulations.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("terms.changesTitle", "Changes to Terms")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("terms.changesDesc", "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.")}
          </p>
        </section>

      </div>
    </div>
  );
}