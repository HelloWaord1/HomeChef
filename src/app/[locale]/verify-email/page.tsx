"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { verifyEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    verifyEmail(token).then((result) => {
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-b from-cream-50 to-warm-50/30">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warm-500 to-warm-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-stone-900">
              Free<span className="text-warm-700">Chef</span>
            </span>
          </Link>
        </div>

        <Card className="border-stone-200/60 shadow-lg shadow-stone-200/30">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold text-stone-900">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-center">
            {status === "loading" && (
              <div className="py-8">
                <Loader2 className="w-10 h-10 animate-spin text-warm-600 mx-auto mb-4" />
                <p className="text-stone-500">{t("verifying")}</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{t("success")}</h3>
                <p className="text-stone-500 mb-6">{t("successDesc")}</p>
                <Button asChild className="bg-warm-700 hover:bg-warm-800 text-white rounded-xl">
                  <Link href="/login">{t("goToLogin")}</Link>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="py-8">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{t("error")}</h3>
                <p className="text-stone-500 mb-6">{t("errorDesc")}</p>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/signup">{t("tryAgain")}</Link>
                </Button>
              </div>
            )}

            {status === "no-token" && (
              <div className="py-8">
                <XCircle className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{t("noToken")}</h3>
                <p className="text-stone-500 mb-6">{t("noTokenDesc")}</p>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/">{t("goHome")}</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
