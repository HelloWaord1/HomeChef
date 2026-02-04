"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  MessageCircle,
  Star,
  ChefHat,
  Loader2,
  Settings,
  Bell,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  // Poll for unread messages and notifications
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [msgRes, notifRes] = await Promise.all([
          fetch("/api/messages/unread"),
          fetch("/api/notifications/unread"),
        ]);
        if (msgRes.ok) {
          const data = await msgRes.json();
          setUnreadCount(data.count);
        }
        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifCount(data.count);
        }
      } catch {
        // ignore
      }
    }

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      href: "/dashboard" as const,
      label: t("overview"),
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/bookings" as const,
      label: t("bookingsNav"),
      icon: CalendarDays,
    },
    {
      href: "/dashboard/dishes" as const,
      label: t("myDishes"),
      icon: UtensilsCrossed,
      cookOnly: true,
    },
    {
      href: "/dashboard/messages" as const,
      label: t("messagesNav"),
      icon: MessageCircle,
      badge: unreadCount,
    },
    {
      href: "/dashboard/notifications" as const,
      label: t("notificationsNav"),
      icon: Bell,
      badge: notifCount,
    },
    {
      href: "/dashboard/reviews" as const,
      label: t("reviewsNav"),
      icon: Star,
    },
    {
      href: "/dashboard/settings" as const,
      label: t("settingsNav"),
      icon: Settings,
    },
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
  const filteredNav = navItems.filter(
    (item) => !item.cookOnly || userRole === "COOK"
  );

  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-8 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-stone-100 shadow-sm p-3">
              <div className="flex items-center gap-3 px-3 py-3 mb-2">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-warm-700" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-xs text-stone-500 capitalize">
                    {userRole?.toLowerCase() || "customer"}
                  </p>
                </div>
              </div>
              <nav className="space-y-0.5">
                {filteredNav.map((item) => {
                  const isActive =
                    pathname.endsWith(item.href) ||
                    (item.href !== "/dashboard" &&
                      pathname.includes(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-warm-50 text-warm-700"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {"badge" in item && item.badge ? (
                        <span className="w-5 h-5 rounded-full bg-warm-700 text-white text-[10px] font-bold flex items-center justify-center">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200 z-40">
        <div className="flex items-center justify-around h-16 px-2">
          {filteredNav.map((item) => {
            const isActive =
              pathname.endsWith(item.href) ||
              (item.href !== "/dashboard" && pathname.includes(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative ${
                  isActive
                    ? "text-warm-700"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {"badge" in item && item.badge ? (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-warm-700 text-white text-[8px] font-bold flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
