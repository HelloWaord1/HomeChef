"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Users,
  DollarSign,
  CalendarDays,
  ChefHat,
} from "lucide-react";

type Booking = {
  id: string;
  status: string;
  date: string;
  guests: number;
  notes: string | null;
  total: number;
  createdAt: string;
  customer: { name: string | null; avatar: string | null; email: string };
  cook: { name: string | null; avatar: string | null; email: string };
  dish: { name: string } | null;
  event: { title: string } | null;
};

export function AdminBookingsClient({ bookings }: { bookings: Booking[] }) {
  const t = useTranslations("admin");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = bookings.filter(
    (b) => statusFilter === "ALL" || b.status === statusFilter
  );

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
      CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
      COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-stone-100 text-stone-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("bookingsTitle")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("bookingsSubtitle")}</p>
      </div>

      {/* Filters */}
      <Card className="border-stone-100">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                className={`rounded-lg text-xs ${statusFilter === status ? "bg-stone-900 text-white" : ""}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === "ALL" ? t("allStatuses") : status}
                {status !== "ALL" && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    ({bookings.filter((b) => b.status === status).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card className="border-stone-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-stone-400" />
            {t("allBookings")} ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("customer")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("cook")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider hidden md:table-cell">{t("item")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider hidden sm:table-cell">{t("date")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("total")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking.id} className="border-b border-stone-50 hover:bg-stone-25">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {booking.customer.avatar ? (
                          <img src={booking.customer.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 text-stone-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-stone-900 text-xs">{booking.customer.name}</p>
                          <p className="text-[10px] text-stone-400">{booking.guests} {t("guests")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {booking.cook.avatar ? (
                          <img src={booking.cook.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-warm-100 flex items-center justify-center">
                            <ChefHat className="w-3.5 h-3.5 text-warm-600" />
                          </div>
                        )}
                        <span className="text-xs text-stone-600">{booking.cook.name}</span>
                      </div>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-xs text-stone-500">
                        {booking.dish?.name || booking.event?.title || t("customBooking")}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-stone-500 hidden sm:table-cell">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span className="text-xs font-semibold text-stone-900">${booking.total}</span>
                    </td>
                    <td className="py-3">
                      <Badge className={`text-[10px] border ${statusBadge(booking.status)}`}>
                        {booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-400">{t("noBookingsFound")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
