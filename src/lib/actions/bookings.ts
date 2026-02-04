"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "./notifications";

export async function createBooking(data: {
  cookId: string;
  dishId?: string;
  eventId?: string;
  date: Date;
  guests: number;
  notes?: string;
  total: number;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to make a booking" };
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: session.user.id,
      cookId: data.cookId,
      dishId: data.dishId || null,
      eventId: data.eventId || null,
      date: data.date,
      guests: data.guests,
      notes: data.notes || null,
      total: data.total,
    },
  });

  // Notify cook about new booking
  try {
    const customerName = session.user?.name || "A customer";
    await createNotification({
      userId: data.cookId,
      type: "BOOKING_NEW",
      title: "New Booking Request",
      message: `${customerName} has requested a booking for ${data.guests} guest(s) — $${data.total}`,
      linkUrl: "/dashboard/bookings",
    });
  } catch {
    // Don't fail booking if notification fails
  }

  return { success: true, bookingId: booking.id };
}

export async function getMyBookings() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { customerId: session.user.id },
        { cookId: session.user.id },
      ],
    },
    include: {
      customer: {
        select: { id: true, name: true, avatar: true, email: true },
      },
      cook: {
        select: { id: true, name: true, avatar: true, email: true },
      },
      dish: {
        select: { id: true, name: true, price: true, image: true },
      },
      event: {
        select: { id: true, title: true, date: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED"
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: { select: { name: true } },
      cook: { select: { name: true } },
    },
  });

  if (!booking) {
    return { error: "Booking not found" };
  }

  // Only the cook or the customer can update
  if (booking.cookId !== session.user.id && booking.customerId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  // Send notification about status change
  try {
    if (status === "CONFIRMED") {
      await createNotification({
        userId: booking.customerId,
        type: "BOOKING_CONFIRMED",
        title: "Booking Confirmed!",
        message: `${booking.cook.name || "Your cook"} has confirmed your booking`,
        linkUrl: "/dashboard/bookings",
      });
    } else if (status === "CANCELLED") {
      const notifyUserId = session.user.id === booking.cookId ? booking.customerId : booking.cookId;
      const cancellerName = session.user.id === booking.cookId ? booking.cook.name : booking.customer.name;
      await createNotification({
        userId: notifyUserId,
        type: "BOOKING_CANCELLED",
        title: "Booking Cancelled",
        message: `${cancellerName || "Someone"} has cancelled the booking`,
        linkUrl: "/dashboard/bookings",
      });
    }
  } catch {
    // Don't fail status update if notification fails
  }

  return { success: true, booking: updated };
}
