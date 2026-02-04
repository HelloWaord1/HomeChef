"use server";

import { prisma } from "@/lib/prisma";

export async function getCooks(filters?: {
  cuisine?: string;
  location?: string;
  search?: string;
  availableOnly?: boolean;
}) {
  const where: Record<string, unknown> = {
    role: "COOK",
  };

  if (filters?.cuisine && filters.cuisine !== "All") {
    where.cuisines = { has: filters.cuisine };
  }

  if (filters?.location && filters.location !== "All") {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { bio: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const cooks = await prisma.user.findMany({
    where: where as never,
    include: {
      dishes: true,
      receivedReviews: {
        include: {
          author: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
    orderBy: { rating: "desc" },
  });

  return cooks;
}

export async function getCook(id: string) {
  const cook = await prisma.user.findUnique({
    where: { id, role: "COOK" },
    include: {
      dishes: {
        where: { available: true },
        orderBy: { createdAt: "desc" },
      },
      receivedReviews: {
        include: {
          author: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      events: {
        where: { status: "UPCOMING" },
        orderBy: { date: "asc" },
      },
    },
  });

  return cook;
}

export async function searchCooks(query: string) {
  const cooks = await prisma.user.findMany({
    where: {
      role: "COOK",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { bio: { contains: query, mode: "insensitive" } },
        { cuisines: { hasSome: [query] } },
        { location: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      dishes: true,
    },
    orderBy: { rating: "desc" },
  });

  return cooks;
}
