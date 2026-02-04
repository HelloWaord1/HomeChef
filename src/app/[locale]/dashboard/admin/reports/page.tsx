import { getReportsData } from "@/lib/actions/admin";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Star,
  DollarSign,
  ChefHat,
} from "lucide-react";

export default async function AdminReportsPage() {
  const t = await getTranslations("admin");

  let data;
  try {
    data = await getReportsData();
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">{t("notAuthorized")}</p>
      </div>
    );
  }

  const signupEntries = Object.entries(data.signupsByMonth).sort(([a], [b]) => a.localeCompare(b));
  const revenueEntries = Object.entries(data.revenueByMonth).sort(([a], [b]) => a.localeCompare(b));
  const maxSignup = Math.max(...signupEntries.map(([, v]) => v), 1);
  const maxRevenue = Math.max(...revenueEntries.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("reportsTitle")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("reportsSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signups Over Time */}
        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              {t("signupsOverTime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signupEntries.length > 0 ? (
              <div className="space-y-3">
                {signupEntries.map(([month, count]) => (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 w-16 flex-shrink-0">{month}</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${Math.max((count / maxSignup) * 100, 8)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 text-center py-8">{t("noData")}</p>
            )}
          </CardContent>
        </Card>

        {/* Revenue Over Time */}
        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              {t("revenueOverTime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueEntries.length > 0 ? (
              <div className="space-y-3">
                {revenueEntries.map(([month, amount]) => (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 w-16 flex-shrink-0">{month}</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${Math.max((amount / maxRevenue) * 100, 8)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">${Math.round(amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 text-center py-8">{t("noData")}</p>
            )}
          </CardContent>
        </Card>

        {/* Bookings by Status */}
        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              {t("bookingsByStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {data.bookingsByStatus.map((item) => {
                const styles: Record<string, { bg: string; text: string; icon: string }> = {
                  PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "bg-yellow-100" },
                  CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", icon: "bg-blue-100" },
                  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "bg-emerald-100" },
                  CANCELLED: { bg: "bg-red-50", text: "text-red-700", icon: "bg-red-100" },
                };
                const style = styles[item.status] || { bg: "bg-stone-50", text: "text-stone-700", icon: "bg-stone-100" };
                return (
                  <div key={item.status} className={`${style.bg} rounded-xl p-4`}>
                    <p className={`text-xs font-medium ${style.text} uppercase tracking-wider`}>
                      {item.status}
                    </p>
                    <p className={`text-2xl font-bold ${style.text} mt-1`}>{item.count}</p>
                  </div>
                );
              })}
              {data.bookingsByStatus.length === 0 && (
                <p className="text-sm text-stone-400 col-span-2 text-center py-4">{t("noData")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Cooks */}
        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              {t("topCooksByRating")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topCooks.map((cook, i) => (
                <div key={cook.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50">
                  <span className="text-sm font-bold text-stone-300 w-6">#{i + 1}</span>
                  {cook.avatar ? (
                    <img src={cook.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-warm-100 flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-warm-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{cook.name}</p>
                    <p className="text-xs text-stone-400">{cook.cuisines.join(", ")}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm font-semibold text-stone-900">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {cook.rating.toFixed(1)}
                    </div>
                    <p className="text-[10px] text-stone-400">
                      {cook.reviewCount} {t("reviews")} · {cook._count.cookBookings} {t("bookings")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
