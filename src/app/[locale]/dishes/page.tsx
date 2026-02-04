import { prisma } from "@/lib/prisma";
import { DishesPageClient } from "@/components/dishes-page-client";

export default async function BrowseDishesPage() {
  const dishes = await prisma.dish.findMany({
    where: { available: true },
    include: {
      cook: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const dishData = dishes.map((dish) => ({
    id: dish.id,
    cookId: dish.cookId,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    image: dish.image || "",
    cuisine: dish.cuisine,
    category: dish.category,
    dietary: dish.allergens, // map allergens as dietary labels
    preparationTime: `${dish.preparationTime} min`,
    servingSize: `${dish.servingSize} people`,
    cookName: dish.cook.name || "Unknown",
    cookSlug: dish.cook.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || dish.cook.id,
  }));

  return <DishesPageClient dishes={dishData} />;
}
