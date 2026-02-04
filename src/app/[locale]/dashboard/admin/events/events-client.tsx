"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cancelEvent } from "@/lib/actions/admin";
import { toast } from "sonner";
import {
  CalendarDays,
  Search,
  XCircle,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxGuests: number;
  pricePerGuest: number;
  cuisine: string;
  status: string;
  createdAt: string;
  host: { name: string | null; avatar: string | null };
  totalGuests: number;
  bookingCount: number;
};

export function AdminEventsClient({ events }: { events: Event[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = events.filter(
    (e) =>
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.cuisine.toLowerCase().includes(search.toLowerCase()) ||
      e.host.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCancel = async (eventId: string, title: string) => {
    if (!confirm(`${t("confirmCancel")} "${title}"?`)) return;
    startTransition(async () => {
      try {
        await cancelEvent(eventId);
        toast.success(t("eventCancelled"));
        router.refresh();
      } catch {
        toast.error(t("actionFailed"));
      }
    });
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      UPCOMING: "bg-blue-50 text-blue-700",
      FULL: "bg-amber-50 text-amber-700",
      COMPLETED: "bg-emerald-50 text-emerald-700",
      CANCELLED: "bg-red-50 text-red-700",
    };
    return colors[status] || "bg-stone-100 text-stone-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("eventsTitle")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("eventsSubtitle")}</p>
      </div>

      <Card className="border-stone-100">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder={t("searchEvents")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-stone-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-stone-400" />
            {t("allEvents")} ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-stone-900 truncate">{event.title}</h3>
                    <Badge className={`${statusBadge(event.status)} text-xs flex-shrink-0`}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.totalGuests}/{event.maxGuests} {t("guests")}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${event.pricePerGuest}/{t("person")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {event.host.avatar && (
                      <img src={event.host.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    )}
                    <span className="text-xs text-stone-400">{t("hostedBy")} {event.host.name}</span>
                    <Badge className="bg-stone-100 text-stone-500 text-[10px]">{event.cuisine}</Badge>
                  </div>
                </div>
                {event.status === "UPCOMING" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs rounded-lg border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleCancel(event.id, event.title)}
                    disabled={isPending}
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    {t("cancelEvent")}
                  </Button>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <CalendarDays className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-400">{t("noEventsFound")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
