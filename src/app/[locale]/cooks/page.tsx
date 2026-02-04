import { prisma } from "@/lib/prisma";
import { CooksPageClient } from "@/components/cooks-page-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://freechef.com";

export default async function BrowseCooksPage() {
  const cooks = await prisma.user.findMany({
    where: { role: "COOK" },
    include: {
      dishes: { select: { id: true } },
      receivedReviews: { select: { id: true } },
    },
    orderBy: { rating: "desc" },
  });

  // Map to the shape the client component expects
  const cookData = cooks.map((cook) => ({
    id: cook.id,
    name: cook.name || "Unknown Cook",
    slug: cook.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || cook.id,
    avatar: cook.avatar || "",
    coverImage: getCoverImage(cook.cuisines[0]),
    bio: cook.bio || "",
    city: cook.location?.split(", ")[0] || "Unknown",
    country: cook.location?.split(", ")[1] || "",
    cuisine: cook.cuisines,
    rating: cook.rating,
    reviewCount: cook.reviewCount,
    completedEvents: cook.dishes.length,
    priceRange: cook.pricePerHour ? `$${cook.pricePerHour}/hr` : "Contact for pricing",
    pricePerHour: cook.pricePerHour,
    verified: cook.verified,
    available: true,
    latitude: cook.latitude,
    longitude: cook.longitude,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Home Cooks on FreeChef",
    description: "Browse talented home cooks available for hire on FreeChef",
    numberOfItems: cookData.length,
    itemListElement: cookData.map((cook, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: cook.name,
        url: `${BASE_URL}/en/cooks/${cook.slug}`,
        image: cook.avatar,
        jobTitle: "Home Cook",
        description: cook.bio,
        address: {
          "@type": "PostalAddress",
          addressLocality: cook.city,
          addressCountry: cook.country,
        },
        aggregateRating: cook.reviewCount > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: cook.rating,
              reviewCount: cook.reviewCount,
              bestRating: 5,
              worstRating: 1,
            }
          : undefined,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CooksPageClient cooks={cookData} />
    </>
  );
}

function getCoverImage(cuisine?: string): string {
  const images: Record<string, string> = {
    Georgian: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop",
    Italian: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1200&h=400&fit=crop",
    Japanese: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=1200&h=400&fit=crop",
    Mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&h=400&fit=crop",
    Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=400&fit=crop",
    Russian: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=1200&h=400&fit=crop",
    Thai: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=1200&h=400&fit=crop",
    Mediterranean: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&h=400&fit=crop",
    French: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop",
    Korean: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&h=400&fit=crop",
  };
  return images[cuisine || ""] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop";
}
