"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  MessageCircle,
  Star,
  ChefHat,
  Loader2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/dashboard/dishes", label: "My Dishes", icon: UtensilsCrossed, cookOnly: true },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

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
          {/* Desktop Sidebar */}
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
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
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
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200 z-40">
        <div className="flex items-center justify-around h-16 px-2">
          {filteredNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? "text-warm-700"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
