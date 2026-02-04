"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"form" | "success" | "error">("form");
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-b from-cream-50 to-warm-50/30">
        <Card className="w-full max-w-md border-stone-200/60 shadow-lg">
          <CardContent className="pt-8 pb-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">{t("invalidLink")}</h3>
            <p className="text-stone-500 mb-6">{t("invalidLinkDesc")}</p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/forgot-password">{t("requestNew")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token!, password);

      if (result.success) {
        setStatus("success");
      } else {
        setError(result.error || t("genericError"));
      }
    } catch {
      setError(t("genericError"));
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
            {status === "success" ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{t("success")}</h3>
                <p className="text-stone-500 text-sm mb-6">{t("successDesc")}</p>
                <Button asChild className="bg-warm-700 hover:bg-warm-800 text-white rounded-xl">
                  <Link href="/login">{t("goToLogin")}</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-stone-700">{t("newPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-stone-200 focus-visible:ring-warm-500/30 focus-visible:border-warm-500"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-stone-700">{t("confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("confirmPlaceholder")}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-11 border-stone-200 focus-visible:ring-warm-500/30 focus-visible:border-warm-500"
                      required
                      minLength={8}
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
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("resetting")}</>
                  ) : (
                    t("resetButton")
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
