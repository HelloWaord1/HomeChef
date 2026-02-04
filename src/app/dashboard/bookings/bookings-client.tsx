"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Check,
  X,
  Clock,
  Users,
  Loader2,
  ChefHat,
} from "lucide-react";
import { toast } from "sonner";

type Booking = {
  id: string;
  status: string;
  date: string;
  guests: number;
  notes: string | null;
  total: number;
  createdAt: string;
  customerId: string;
  cookId: string;
  customer: { id: string; name: string | null; avatar: string | null; email: string | null };
  cook: { id: string; name: string | null; avatar: string | null; email: string | null };
  dish: { id: string; name: string; price: number; image: string | null } | null;
  event: { id: string; title: string; date: string } | null;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-stone-50 text-stone-500 border-stone-200",
};

export function BookingsClient({
  bookings: initialBookings,
  role,
}: {
  bookings: Booking[];
  role: string;
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<string>("ALL");

  const filtered =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const counts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Bookings</h1>
        <p className="text-stone-500 text-sm mt-1">
          {role === "COOK"
            ? "Manage your incoming booking requests"
            : "Track your booking history"}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === status
                  ? "bg-warm-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}{" "}
              ({counts[status]})
            </button>
          )
        )}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <ChefHat className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              role={role}
              onUpdate={(id, status) => {
                setBookings((prev) =>
                  prev.map((b) => (b.id === id ? { ...b, status } : b))
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  role,
  onUpdate,
}: {
  booking: Booking;
  role: string;
  onUpdate: (id: string, status: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const otherPerson = role === "COOK" ? booking.customer : booking.cook;

  async function handleStatusUpdate(status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
    startTransition(async () => {
      const result = await updateBookingStatus(booking.id, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          status === "CONFIRMED"
            ? "Booking confirmed!"
            : status === "CANCELLED"
              ? "Booking cancelled"
              : "Booking marked as completed"
        );
        onUpdate(booking.id, status);
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Person Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {otherPerson.avatar ? (
            <img
              src={otherPerson.avatar}
              alt=""
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500 flex-shrink-0">
              {otherPerson.name?.[0] || "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-stone-900 truncate">
              {otherPerson.name}
            </p>
            <p className="text-xs text-stone-400">{otherPerson.email}</p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`text-[10px] font-medium flex-shrink-0 ${statusStyles[booking.status] || ""}`}
        >
          {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
        </Badge>
      </div>

      {/* Booking Details */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
        {booking.dish && (
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-stone-400" />
            {booking.dish.name}
          </div>
        )}
        {booking.event && (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
            {booking.event.title}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          {new Date(booking.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-stone-400" />
          {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
        </div>
        <div className="font-semibold text-stone-900">${booking.total}</div>
      </div>

      {booking.notes && (
        <p className="mt-3 text-sm text-stone-500 bg-stone-50 rounded-xl p-3">
          {booking.notes}
        </p>
      )}

      {/* Actions for cook on pending bookings */}
      {role === "COOK" && booking.status === "PENDING" && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            onClick={() => handleStatusUpdate("CONFIRMED")}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full text-xs"
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Check className="w-3 h-3 mr-1" />
            )}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate("CANCELLED")}
            disabled={isPending}
            className="rounded-full text-xs border-red-200 text-red-600 hover:bg-red-50"
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <X className="w-3 h-3 mr-1" />
            )}
            Decline
          </Button>
        </div>
      )}

      {/* Complete action for cook on confirmed bookings */}
      {role === "COOK" && booking.status === "CONFIRMED" && (
        <div className="mt-4">
          <Button
            size="sm"
            onClick={() => handleStatusUpdate("COMPLETED")}
            disabled={isPending}
            className="bg-warm-700 hover:bg-warm-800 text-white rounded-full text-xs"
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Check className="w-3 h-3 mr-1" />
            )}
            Mark Complete
          </Button>
        </div>
      )}

      {/* Cancel for customer */}
      {role === "CUSTOMER" &&
        (booking.status === "PENDING" || booking.status === "CONFIRMED") && (
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={isPending}
              className="rounded-full text-xs border-red-200 text-red-600 hover:bg-red-50"
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <X className="w-3 h-3 mr-1" />
              )}
              Cancel Booking
            </Button>
          </div>
        )}
    </div>
  );
}
