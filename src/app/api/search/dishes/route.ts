import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
  const excludeAllergens = searchParams.get("excludeAllergens") || "";
  const sort = searchParams.get("sort") || "name";

  const where: Record<string, unknown> = { available: true };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { cuisine: { contains: q, mode: "insensitive" } },
    ];
  }

  if (cuisine) {
    where.cuisine = { in: cuisine.split(",") };
  }

  if (category) {
    where.category = { in: category.split(",") };
  }

  if (minPrice !== undefined) {
    where.price = { ...((where.price as object) || {}), gte: minPrice };
  }
  if (maxPrice !== undefined) {
    where.price = { ...((where.price as object) || {}), lte: maxPrice };
  }

  let orderBy: Record<string, string> = { name: "asc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "name") orderBy = { name: "asc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };

  const dishes = await prisma.dish.findMany({
    where,
    include: {
      cook: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy,
  });

  // Post-filter: exclude allergens
  let results = dishes;
  if (excludeAllergens) {
    const excluded = excludeAllergens.split(",").map((a) => a.trim().toLowerCase());
    results = results.filter((dish) =>
      !dish.allergens.some((a) => excluded.includes(a.toLowerCase()))
    );
  }

  const data = results.map((dish) => ({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    image: dish.image || "",
    cuisine: dish.cuisine,
    category: dish.category,
    allergens: dish.allergens,
    preparationTime: dish.preparationTime,
    servingSize: dish.servingSize,
    cookId: dish.cookId,
    cookName: dish.cook.name || "Unknown",
    cookSlug: dish.cook.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || dish.cook.id,
  }));

  return NextResponse.json(data);
}
