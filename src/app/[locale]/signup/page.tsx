"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { register } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "COOK">("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register({ name, email, password, role });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Show verification link (MVP — no real email sending)
      if (result.verificationToken) {
        const base = typeof window !== "undefined" ? window.location.origin : "";
        const link = `${base}/${locale}/verify-email?token=${result.verificationToken}`;
        setVerificationLink(link);
      }

      // Auto-login after registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(t("accountCreatedLoginFailed"));
        router.push("/login");
      } else {
        if (!verificationLink) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch {
      setError(t("somethingWrong"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/" });
  }

  // Show verification notice after signup
  if (verificationLink) {
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
            <CardContent className="pt-8 pb-6 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-stone-900 mb-2">{t("accountCreated")}</h2>
              <p className="text-stone-500 mb-6">{t("verifyEmailNotice")}</p>
              <div className="p-3 rounded-xl bg-warm-50 border border-warm-200 text-left mb-6">
                <p className="text-xs font-semibold text-warm-700 mb-1">{t("verificationLink")}:</p>
                <a
                  href={verificationLink}
                  className="text-xs text-warm-600 hover:text-warm-800 break-all underline"
                >
                  {verificationLink}
                </a>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1 rounded-xl">
                  <a href={verificationLink}>{t("verifyNow")}</a>
                </Button>
                <Button asChild className="flex-1 bg-warm-700 hover:bg-warm-800 text-white rounded-xl">
                  <Link href="/dashboard">{t("goToDashboard")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-b from-cream-50 to-warm-50/30">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warm-500 to-warm-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-stone-900">
              Free<span className="text-warm-700">Chef</span>
            </span>
          </Link>
          <p className="text-stone-500 text-sm">{t("joinCommunity")}</p>
        </div>

        <Card className="border-stone-200/60 shadow-lg shadow-stone-200/30">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold text-stone-900">{t("signupTitle")}</CardTitle>
            <CardDescription className="text-stone-500">
              {t("signupDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Google Button */}
            <Button
              variant="outline"
              className="w-full h-11 text-stone-700 border-stone-200 hover:bg-stone-50 font-medium"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t("continueGoogle")}
            </Button>

            <div className="relative my-6">
              <Separator className="bg-stone-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-stone-400 uppercase tracking-wider">
                {t("or")}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-stone-700">{t("fullName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("namePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 border-stone-200 focus-visible:ring-warm-500/30 focus-visible:border-warm-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700">{t("email")}</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-700">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("minChars")}
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

              {/* Role selector */}
              <div className="space-y-2">
                <Label className="text-stone-700">{t("iWantTo")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("CUSTOMER")}
                    className={`p-3 rounded-xl text-center transition-all ${
                      role === "CUSTOMER"
                        ? "bg-warm-50 border-2 border-warm-500 shadow-sm"
                        : "bg-stone-50 border-2 border-transparent hover:border-stone-200"
                    }`}
                  >
                    <span className="text-2xl block mb-1">🍽️</span>
                    <span className={`text-sm font-semibold block ${
                      role === "CUSTOMER" ? "text-warm-700" : "text-stone-700"
                    }`}>
                      {t("hireCook")}
                    </span>
                    <span className="text-xs text-stone-400">{t("customer")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("COOK")}
                    className={`p-3 rounded-xl text-center transition-all ${
                      role === "COOK"
                        ? "bg-sage-50 border-2 border-sage-500 shadow-sm"
                        : "bg-stone-50 border-2 border-transparent hover:border-stone-200"
                    }`}
                  >
                    <span className="text-2xl block mb-1">👨‍🍳</span>
                    <span className={`text-sm font-semibold block ${
                      role === "COOK" ? "text-sage-700" : "text-stone-700"
                    }`}>
                      {t("cookForPeople")}
                    </span>
                    <span className="text-xs text-stone-400">{t("cook")}</span>
                  </button>
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
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("creatingAccount")}</>
                ) : (
                  t("createAccount")
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-500">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-warm-700 hover:text-warm-800 font-semibold transition-colors">
                {t("loginLink")}
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-stone-400 leading-relaxed">
              {t("termsAgree")}{" "}
              <span className="underline cursor-pointer hover:text-stone-500">{t("termsOfService")}</span> {t("and")}{" "}
              <span className="underline cursor-pointer hover:text-stone-500">{t("privacyPolicy")}</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
