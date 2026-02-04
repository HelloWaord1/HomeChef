"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

export async function createDish(data: {
  name: string;
  description: string;
  price: number;
  cuisine: string;
  category: string;
  image?: string;
  preparationTime: number;
  servingSize: number;
  ingredients: string[];
  allergens: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const dish = await prisma.dish.create({
    data: {
      ...data,
      image: data.image || null,
      cookId: session.user.id,
    },
  });

  return { success: true, dishId: dish.id };
}

export async function updateDish(
  dishId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    cuisine?: string;
    category?: string;
    image?: string;
    preparationTime?: number;
    servingSize?: number;
    ingredients?: string[];
    allergens?: string[];
    available?: boolean;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish || dish.cookId !== session.user.id) {
    return { error: "Dish not found or unauthorized" };
  }

  const updated = await prisma.dish.update({
    where: { id: dishId },
    data,
  });

  return { success: true, dish: updated };
}

export async function deleteDish(dishId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish || dish.cookId !== session.user.id) {
    return { error: "Dish not found or unauthorized" };
  }

  await prisma.dish.delete({ where: { id: dishId } });

  return { success: true };
}
