"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  CalendarDays,
  ClipboardList,
  BarChart3,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const t = useTranslations("admin");

  const navItems = [
    { href: "/dashboard/admin" as const, label: t("overview"), icon: LayoutDashboard },
    { href: "/dashboard/admin/users" as const, label: t("users"), icon: Users },
    { href: "/dashboard/admin/dishes" as const, label: t("dishes"), icon: UtensilsCrossed },
    { href: "/dashboard/admin/events" as const, label: t("events"), icon: CalendarDays },
    { href: "/dashboard/admin/bookings" as const, label: t("bookings"), icon: ClipboardList },
    { href: "/dashboard/admin/reports" as const, label: t("reports"), icon: BarChart3 },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-warm-600" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    redirect("/login");
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen pt-20 pb-8 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-stone-100 shadow-sm p-3">
              <div className="flex items-center gap-3 px-3 py-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{t("adminPanel")}</p>
                  <p className="text-xs text-stone-500">{session.user?.name || "Admin"}</p>
                </div>
              </div>
              <nav className="space-y-0.5">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/dashboard/admin"
                      ? pathname.endsWith("/dashboard/admin") || pathname.endsWith("/dashboard/admin/")
                      : pathname.includes(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-red-50 text-red-700"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                  {t("backToDashboard")}
                </Link>
              </div>
            </div>
          </aside>

          {/* Mobile nav */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200 z-40">
            <div className="flex items-center justify-around h-16 px-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard/admin"
                    ? pathname.endsWith("/dashboard/admin") || pathname.endsWith("/dashboard/admin/")
                    : pathname.includes(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors ${
                      isActive ? "text-red-700" : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[9px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
