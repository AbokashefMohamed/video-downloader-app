import { useTranslation } from "react-i18next";

export function CopyrightPage() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col gap-6">
        
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("copyright.title", "Copyright Notice")}
          </h1>
          <p className="text-white/50 text-sm">
            {t("copyright.lastUpdated", "Last updated")}: {currentYear}
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("copyright.ownershipTitle", "Ownership")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("copyright.ownershipDesc", "© " + currentYear + " VideoDL. All rights reserved. The VideoDL name, logo, and all related content are the intellectual property of VideoDL.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("copyright.downloadedContentTitle", "Downloaded Content")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("copyright.downloadedContentDesc", "VideoDL is a tool that allows users to download publicly available content. Users are solely responsible for ensuring they have the right to download and use any content obtained through this service. Downloaded content remains the intellectual property of its original creators.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("copyright.dmcaTitle", "DMCA Policy")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("copyright.dmcaDesc", "We respect intellectual property rights. If you believe any content facilitated by this service infringes your copyright, please contact us. We will respond promptly to all valid DMCA notices.")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg">
            {t("copyright.personalUseTitle", "Personal Use Only")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t("copyright.personalUseDesc", "This service is intended for personal, non-commercial use only. Downloading copyrighted content without permission from the rights holder may violate copyright law in your country.")}
          </p>
        </section>

      </div>
    </div>
  );
}