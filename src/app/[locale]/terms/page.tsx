import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <div className="min-h-screen pt-28 pb-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToHome")}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2">{t("title")}</h1>
        <p className="text-sm text-stone-400 mb-12">{t("lastUpdated")}</p>

        <div className="prose prose-stone max-w-none prose-headings:text-stone-900 prose-p:text-stone-600 prose-p:leading-relaxed prose-li:text-stone-600">
          <h2>{t("section1Title")}</h2>
          <p>{t("section1Text")}</p>

          <h2>{t("section2Title")}</h2>
          <p>{t("section2Text")}</p>

          <h2>{t("section3Title")}</h2>
          <p>{t("section3Text")}</p>

          <h2>{t("section4Title")}</h2>
          <p>{t("section4Text")}</p>

          <h2>{t("section5Title")}</h2>
          <p>{t("section5Text")}</p>

          <h2>{t("section6Title")}</h2>
          <p>{t("section6Text")}</p>

          <h2>{t("section7Title")}</h2>
          <p>{t("section7Text")}</p>
        </div>
      </div>
    </div>
  );
}
