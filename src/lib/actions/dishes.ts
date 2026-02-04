"use server";

import { prisma } from "@/lib/prisma";

export async function getDishes(filters?: {
  cuisine?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  allergens?: string[];
}) {
  const where: Record<string, unknown> = {
    available: true,
  };

  if (filters?.cuisine && filters.cuisine !== "All") {
    where.cuisine = filters.cuisine;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { cuisine: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {};
    if (filters?.minPrice !== undefined)
      (where.price as Record<string, number>).gte = filters.minPrice;
    if (filters?.maxPrice !== undefined)
      (where.price as Record<string, number>).lte = filters.maxPrice;
  }

  const dishes = await prisma.dish.findMany({
    where: where as never,
    include: {
      cook: {
        select: {
          id: true,
          name: true,
          avatar: true,
          rating: true,
          location: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return dishes;
}

export async function getDish(id: string) {
  const dish = await prisma.dish.findUnique({
    where: { id },
    include: {
      cook: {
        select: {
          id: true,
          name: true,
          avatar: true,
          rating: true,
          reviewCount: true,
          location: true,
          bio: true,
        },
      },
    },
  });

  return dish;
}
