import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
  const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
  const sort = searchParams.get("sort") || "rating";
  const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : undefined;
  const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : undefined;
  const maxDistance = searchParams.get("maxDistance") ? parseFloat(searchParams.get("maxDistance")!) : undefined;

  // Build where clause
  const where: Record<string, unknown> = { role: "COOK" as const };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { bio: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
      { cuisines: { hasSome: [q] } },
    ];
  }

  if (cuisine) {
    where.cuisines = { hasSome: cuisine.split(",") };
  }

  if (minPrice !== undefined) {
    where.pricePerHour = { ...((where.pricePerHour as object) || {}), gte: minPrice };
  }
  if (maxPrice !== undefined) {
    where.pricePerHour = { ...((where.pricePerHour as object) || {}), lte: maxPrice };
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  // Determine sort order
  let orderBy: Record<string, string> = { rating: "desc" };
  if (sort === "price") orderBy = { pricePerHour: "asc" };
  else if (sort === "reviews") orderBy = { reviewCount: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };

  const cooks = await prisma.user.findMany({
    where,
    include: {
      dishes: { select: { id: true } },
    },
    orderBy,
  });

  // Post-process for distance if lat/lng provided
  let results = cooks.map((cook) => {
    let distance: number | null = null;
    if (lat !== undefined && lng !== undefined && cook.latitude && cook.longitude) {
      distance = haversineDistance(lat, lng, cook.latitude, cook.longitude);
    }
    return {
      id: cook.id,
      name: cook.name || "Unknown Cook",
      slug: cook.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || cook.id,
      avatar: cook.avatar || "",
      bio: cook.bio || "",
      location: cook.location || "",
      city: cook.location?.split(", ")[0] || "Unknown",
      country: cook.location?.split(", ")[1] || "",
      cuisines: cook.cuisines,
      rating: cook.rating,
      reviewCount: cook.reviewCount,
      pricePerHour: cook.pricePerHour,
      verified: cook.verified,
      dishCount: cook.dishes.length,
      latitude: cook.latitude,
      longitude: cook.longitude,
      distance,
    };
  });

  // Filter by distance if requested
  if (lat !== undefined && lng !== undefined && maxDistance !== undefined) {
    results = results.filter((c) => c.distance !== null && c.distance <= maxDistance);
  }

  // Sort by distance if location is provided and sort is "distance"
  if (sort === "distance" && lat !== undefined && lng !== undefined) {
    results.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }

  return NextResponse.json(results);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
