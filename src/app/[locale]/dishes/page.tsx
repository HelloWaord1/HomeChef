import { prisma } from "@/lib/prisma";
import { DishesPageClient } from "@/components/dishes-page-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://freechef.com";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Home-Cooked Dishes on FreeChef",
    description: "Browse home-cooked dishes from talented local cooks",
    numberOfItems: dishData.length,
    itemListElement: dishData.map((dish, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: dish.name,
        description: dish.description,
        image: dish.image,
        offers: {
          "@type": "Offer",
          price: dish.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DishesPageClient dishes={dishData} />
    </>
  );
}
