import { prisma } from "@/lib/prisma";
import { EventsPageClient } from "@/components/events-page-client";

export default async function BrowseEventsPage() {
  const events = await prisma.event.findMany({
    include: {
      host: {
        select: { id: true, name: true, avatar: true },
      },
      bookings: { select: { id: true } },
    },
    orderBy: { date: "asc" },
  });

  const eventData = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: event.date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    location: event.location,
    city: event.location.split(", ").slice(-2, -1)[0] || event.location.split(", ")[0] || "Unknown",
    country: event.location.split(", ").pop() || "",
    maxGuests: event.maxGuests,
    pricePerGuest: event.pricePerGuest,
    cuisine: event.cuisine,
    status: event.status.toLowerCase() as "open" | "in-progress" | "completed",
    hostName: event.host.name || "Unknown",
    hostAvatar: event.host.avatar || "",
    bookingCount: event.bookings.length,
    createdAt: event.createdAt.toISOString(),
  }));

  return <EventsPageClient events={eventData} />;
}
