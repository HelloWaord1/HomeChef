"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { requestPasswordReset } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success && result.resetToken) {
        const base = typeof window !== "undefined" ? window.location.origin : "";
        const link = `${base}/${locale}/reset-password?token=${result.resetToken}`;
        setResetLink(link);
      } else if (result.success) {
        // Email not found — but we don't tell the user (security)
        setResetLink("sent");
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

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
            <CardTitle className="text-xl font-semibold text-stone-900">{t("title")}</CardTitle>
            <CardDescription className="text-stone-500">
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {resetLink ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{t("sent")}</h3>
                <p className="text-stone-500 text-sm mb-6">{t("sentDesc")}</p>
                {resetLink !== "sent" && (
                  <div className="p-3 rounded-xl bg-warm-50 border border-warm-200 text-left mb-6">
                    <p className="text-xs font-semibold text-warm-700 mb-1">{t("resetLink")}:</p>
                    <a
                      href={resetLink}
                      className="text-xs text-warm-600 hover:text-warm-800 break-all underline"
                    >
                      {resetLink}
                    </a>
                  </div>
                )}
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    {t("backToLogin")}
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-stone-700">{t("emailLabel")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-stone-200 focus-visible:ring-warm-500/30 focus-visible:border-warm-500"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-warm-700 hover:bg-warm-800 text-white font-medium rounded-xl"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("sending")}</>
                  ) : (
                    t("sendReset")
                  )}
                </Button>

                <p className="text-center">
                  <Link href="/login" className="text-sm text-stone-500 hover:text-stone-700 font-medium">
                    <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                    {t("backToLogin")}
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
