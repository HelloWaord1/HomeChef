import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChefHat } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-warm-500 to-warm-700 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Free<span className="text-warm-400">Chef</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-500">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
              {t("discover")}
            </h4>
            <ul className="space-y-3">
              <li><Link href="/cooks" className="text-sm hover:text-white transition-colors">{t("browseCooks")}</Link></li>
              <li><Link href="/dishes" className="text-sm hover:text-white transition-colors">{t("browseDishes")}</Link></li>
              <li><Link href="/events" className="text-sm hover:text-white transition-colors">{t("cookingEvents")}</Link></li>
              <li><Link href="/for-cooks" className="text-sm hover:text-white transition-colors">{t("becomeCook")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
              {t("company")}
            </h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">{t("pricing")}</Link></li>
              <li><span className="text-sm text-stone-600 cursor-default">{t("careers")}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
              {t("support")}
            </h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-stone-600 cursor-default">{t("helpCenter")}</span></li>
              <li><span className="text-sm text-stone-600 cursor-default">{t("safety")}</span></li>
              <li><Link href="/terms" className="text-sm hover:text-white transition-colors">{t("terms")}</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">{t("privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">{t("copyright")}</p>
          <p className="text-xs text-stone-600">{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
