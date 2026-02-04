import { getAdminBookings } from "@/lib/actions/admin";
import { getTranslations } from "next-intl/server";
import { AdminBookingsClient } from "./bookings-client";

export default async function AdminBookingsPage() {
  const t = await getTranslations("admin");

  let bookings;
  try {
    bookings = await getAdminBookings();
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">{t("notAuthorized")}</p>
      </div>
    );
  }

  const serialized = bookings.map((b) => ({
    ...b,
    date: b.date.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }));

  return <AdminBookingsClient bookings={serialized} />;
}
