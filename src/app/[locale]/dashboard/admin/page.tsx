import { getStats } from "@/lib/actions/admin";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ChefHat,
  CalendarDays,
  DollarSign,
  UtensilsCrossed,
  Star,
  TrendingUp,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const t = await getTranslations("admin");

  let stats;
  try {
    stats = await getStats();
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">{t("notAuthorized")}</p>
      </div>
    );
  }

  const statCards = [
    {
      label: t("totalUsers"),
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      sub: `${stats.totalCooks} ${t("cooks")} · ${stats.totalCustomers} ${t("customers")}`,
    },
    {
      label: t("totalBookings"),
      value: stats.totalBookings,
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-600",
      sub: `${stats.totalEvents} ${t("events")}`,
    },
    {
      label: t("totalRevenue"),
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      sub: t("confirmedCompleted"),
    },
    {
      label: t("totalDishes"),
      value: stats.totalDishes,
      icon: UtensilsCrossed,
      color: "bg-purple-50 text-purple-600",
      sub: `${stats.totalReviews} ${t("reviews")}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("overviewTitle")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("overviewSubtitle")}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-stone-100">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-stone-400 mt-1">{stat.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Status */}
        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-stone-400" />
              {t("bookingsByStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.bookingsByStatus.map((item) => {
                const colors: Record<string, string> = {
                  PENDING: "bg-yellow-100 text-yellow-800",
                  CONFIRMED: "bg-blue-100 text-blue-800",
                  COMPLETED: "bg-emerald-100 text-emerald-800",
                  CANCELLED: "bg-red-100 text-red-800",
                };
                return (
                  <div key={item.status} className="flex items-center justify-between">
                    <Badge className={`${colors[item.status] || "bg-stone-100 text-stone-800"} text-xs`}>
                      {item.status}
                    </Badge>
                    <span className="text-sm font-semibold text-stone-900">{item.count}</span>
                  </div>
                );
              })}
              {stats.bookingsByStatus.length === 0 && (
                <p className="text-sm text-stone-400">{t("noData")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Cooks */}
        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              {t("topCooks")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCooks.map((cook, i) => (
                <div key={cook.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-400 w-5">#{i + 1}</span>
                  {cook.avatar ? (
                    <img src={cook.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-warm-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{cook.name}</p>
                    <p className="text-xs text-stone-400">{cook.cuisines.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-stone-900">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {cook.rating.toFixed(1)}
                    </div>
                    <p className="text-[10px] text-stone-400">{cook.reviewCount} {t("reviews")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="border-stone-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-400" />
            {t("recentSignups")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("name")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("email")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("role")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("joined")}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-stone-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 text-stone-400" />
                          </div>
                        )}
                        <span className="font-medium text-stone-900">{user.name || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-stone-500">{user.email}</td>
                    <td className="py-3">
                      <Badge
                        className={`text-xs ${
                          user.role === "COOK"
                            ? "bg-warm-50 text-warm-700"
                            : user.role === "ADMIN"
                            ? "bg-red-50 text-red-700"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-stone-400">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
