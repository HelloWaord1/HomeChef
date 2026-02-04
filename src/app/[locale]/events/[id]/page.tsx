import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  ChefHat,
  Clock,
  MessageSquare,
} from "lucide-react";
import { JoinEventButton } from "@/components/join-event-button";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      host: {
        select: { id: true, name: true, avatar: true },
      },
      bookings: {
        include: {
          customer: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const spotsLeft = event.maxGuests - event.bookings.length;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-warm-400 to-warm-600" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-warm-50 text-warm-700 border-warm-200 border text-xs font-medium">
                    {event.cuisine}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      event.status === "UPCOMING"
                        ? "border-sage-300 text-sage-700"
                        : event.status === "FULL"
                        ? "border-amber-300 text-amber-700"
                        : "border-stone-300 text-stone-700"
                    }`}
                  >
                    {event.status === "UPCOMING" && spotsLeft > 0
                      ? `🟢 ${spotsLeft} spots left`
                      : event.status === "FULL"
                      ? "🟡 Full"
                      : event.status === "COMPLETED"
                      ? "✅ Completed"
                      : "🔴 Cancelled"}
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {event.host.avatar ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden">
                        <Image
                          src={event.host.avatar}
                          alt={event.host.name || "Host"}
                          width={28}
                          height={28}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium">
                        {event.host.name?.[0] || "?"}
                      </div>
                    )}
                    <span className="text-sm text-stone-600">
                      Hosted by <strong className="text-stone-700">{event.host.name}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {event.location}
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Date & Time
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {event.date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  Group Size
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {event.maxGuests} people
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {event.bookings.length} joined
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Price
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  ${event.pricePerGuest}/person
                </p>
                <p className="text-xs text-warm-600 font-medium mt-0.5">
                  ${event.pricePerGuest * event.maxGuests} total
                </p>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-6">
                <div className="bg-cream-50 rounded-xl p-5 border border-cream-200">
                  <h3 className="text-sm font-semibold text-stone-700 mb-2">About this event</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            )}

            {/* Join CTA */}
            {event.status === "UPCOMING" && spotsLeft > 0 && (
              <div className="bg-gradient-to-r from-warm-50 to-cream-50 rounded-xl p-5 border border-warm-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-semibold text-stone-800">
                    Join this event! {spotsLeft} spots remaining.
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    ${event.pricePerGuest} per person
                  </p>
                </div>
                <JoinEventButton
                  eventId={event.id}
                  hostId={event.hostId}
                  pricePerGuest={event.pricePerGuest}
                  eventDate={event.date.toISOString()}
                />
              </div>
            )}
          </div>
        </div>

        {/* Guests */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-warm-600" />
              Guests
              <span className="text-sm font-normal text-stone-400">
                ({event.bookings.length})
              </span>
            </h2>
          </div>

          {event.bookings.length > 0 ? (
            <div className="space-y-3">
              {event.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3"
                >
                  {booking.customer.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={booking.customer.avatar}
                        alt={booking.customer.name || "Guest"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-medium text-stone-500">
                      {booking.customer.name?.[0] || "?"}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-stone-900 text-sm">{booking.customer.name}</p>
                    <p className="text-xs text-stone-500">
                      {booking.guests} {booking.guests === 1 ? "guest" : "guests"} · {booking.status.toLowerCase()}
                    </p>
                  </div>
                  <span className="text-xs text-stone-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-100">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-7 h-7 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-1">No guests yet</h3>
              <p className="text-sm text-stone-500 mb-4">Be the first to join this event!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
