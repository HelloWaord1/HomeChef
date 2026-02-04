"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/actions/admin";
import { toast } from "sonner";
import {
  Users,
  Search,
  ShieldCheck,
  ShieldOff,
  Star,
  ChefHat,
} from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatar: string | null;
  verified: boolean;
  createdAt: string;
  location: string | null;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  _count: { bookings: number; cookBookings: number; dishes: number };
};

export function AdminUsersClient({ users }: { users: User[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleVerify = async (userId: string, currentVerified: boolean) => {
    startTransition(async () => {
      try {
        await updateUser(userId, { verified: !currentVerified });
        toast.success(currentVerified ? t("cookUnverified") : t("cookVerified"));
        router.refresh();
      } catch {
        toast.error(t("actionFailed"));
      }
    });
  };

  const roleBadgeClass = (role: string) => {
    switch (role) {
      case "COOK":
        return "bg-warm-50 text-warm-700 border-warm-200";
      case "ADMIN":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-stone-100 text-stone-600 border-stone-200";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("usersTitle")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("usersSubtitle")}</p>
      </div>

      {/* Filters */}
      <Card className="border-stone-100">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                placeholder={t("searchUsers")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              {["ALL", "CUSTOMER", "COOK", "ADMIN"].map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? "default" : "outline"}
                  size="sm"
                  className={`rounded-lg text-xs ${roleFilter === role ? "bg-stone-900 text-white" : ""}`}
                  onClick={() => setRoleFilter(role)}
                >
                  {role === "ALL" ? t("allRoles") : role}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-stone-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-400" />
            {t("usersList")} ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("user")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("role")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider hidden md:table-cell">{t("location")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider hidden lg:table-cell">{t("stats")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-stone-50 hover:bg-stone-25">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-stone-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-stone-900 flex items-center gap-1.5">
                            {user.name || "—"}
                            {user.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </p>
                          <p className="text-xs text-stone-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge className={`text-xs border ${roleBadgeClass(user.role)}`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-stone-500 hidden md:table-cell">
                      {user.location || "—"}
                    </td>
                    <td className="py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        {user.role === "COOK" && (
                          <>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              {user.rating.toFixed(1)}
                            </span>
                            <span>{user._count.dishes} {t("dishes")}</span>
                            <span>{user._count.cookBookings} {t("bookings")}</span>
                          </>
                        )}
                        {user.role === "CUSTOMER" && (
                          <span>{user._count.bookings} {t("bookings")}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {user.role === "COOK" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs rounded-lg h-7 ${
                              user.verified
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }`}
                            onClick={() => handleToggleVerify(user.id, user.verified)}
                            disabled={isPending}
                          >
                            {user.verified ? (
                              <>
                                <ShieldOff className="w-3 h-3 mr-1" />
                                {t("unverify")}
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                {t("verify")}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-400">{t("noUsersFound")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
