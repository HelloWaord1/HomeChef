import { getAdminEvents } from "@/lib/actions/admin";
import { getTranslations } from "next-intl/server";
import { AdminEventsClient } from "./events-client";

export default async function AdminEventsPage() {
  const t = await getTranslations("admin");

  let events;
  try {
    events = await getAdminEvents();
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">{t("notAuthorized")}</p>
      </div>
    );
  }

  const serialized = events.map((e) => ({
    ...e,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
    totalGuests: e.bookings.reduce((sum, b) => sum + b.guests, 0),
    bookingCount: e.bookings.length,
  }));

  return <AdminEventsClient events={serialized} />;
}
