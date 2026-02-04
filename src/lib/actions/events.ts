"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getEvents(filters?: {
  cuisine?: string;
  location?: string;
  status?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.cuisine && filters.cuisine !== "All") {
    where.cuisine = filters.cuisine;
  }

  if (filters?.location && filters.location !== "All") {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { cuisine: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const events = await prisma.event.findMany({
    where: where as never,
    include: {
      host: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      bookings: {
        select: { id: true },
      },
    },
    orderBy: { date: "asc" },
  });

  return events;
}

export async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          avatar: true,
          rating: true,
          reviewCount: true,
        },
      },
      bookings: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  return event;
}

export async function createEvent(data: {
  title: string;
  description: string;
  date: Date;
  location: string;
  maxGuests: number;
  pricePerGuest: number;
  cuisine: string;
  image?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to create an event" };
  }

  const event = await prisma.event.create({
    data: {
      ...data,
      hostId: session.user.id,
    },
  });

  return { success: true, eventId: event.id };
}
