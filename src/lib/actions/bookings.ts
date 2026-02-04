"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

  return { success: true, booking: updated };
}
