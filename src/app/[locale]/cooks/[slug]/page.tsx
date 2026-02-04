import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  Star,
  CalendarDays,
  Clock,
  Zap,
  DollarSign,
} from "lucide-react";
import { BookCookButton } from "@/components/book-cook-button";

interface CookProfilePageProps {
  params: Promise<{ slug: string }>;
}

async function getCookByIdOrSlug(slug: string) {
  // Try to find by ID first (slug in our case is the user ID)
  let cook = await prisma.user.findFirst({
    where: { id: slug, role: "COOK" },
    include: {
      dishes: { where: { available: true }, orderBy: { createdAt: "desc" } },
      receivedReviews: {
        include: { author: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Fallback: try matching by name slug
  if (!cook) {
    const allCooks = await prisma.user.findMany({
      where: { role: "COOK" },
      include: {
        dishes: { where: { available: true }, orderBy: { createdAt: "desc" } },
        receivedReviews: {
          include: { author: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    cook = allCooks.find(
      (c) =>
        c.name
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") === slug
    ) ?? null;
  }

  return cook;
}

export default async function CookProfilePage({ params }: CookProfilePageProps) {
  const { slug } = await params;
  const cook = await getCookByIdOrSlug(slug);

  if (!cook) {
    notFound();
  }

  const cookSlug = cook.name
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") ?? cook.id;

  const [city, country] = (cook.location ?? "Unknown").split(", ");

  // Cover images based on cuisine
  const coverImages: Record<string, string> = {
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

  const coverImage = coverImages[cook.cuisines[0]] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop";

  return (
    <div className="pt-20 pb-16">
      {/* Cover */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <Image
          src={coverImage}
          alt={`${cook.name}'s kitchen`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-6 left-4 sm:left-8">
          <Link href="/cooks">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-white rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-16 sm:-mt-20 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                <Image
                  src={cook.avatar || "/globe.svg"}
                  alt={cook.name || "Cook"}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                  {cook.name}
                </h1>
                {cook.verified && (
                  <ShieldCheck className="w-5 h-5 text-sage-500" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
                {cook.cuisines.map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="bg-warm-100 text-warm-700 border-0 text-xs"
                  >
                    {c}
                  </Badge>
                ))}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {cook.location}
                </span>
              </div>
            </div>

            <BookCookButton cookId={cook.id} cookName={cook.name || "Cook"} />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-bold text-stone-900">
                  {cook.rating}
                </span>
              </div>
              <p className="text-xs text-stone-500">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900 mb-1">
                {cook.reviewCount}
              </p>
              <p className="text-xs text-stone-500">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900 mb-1">
                {cook.dishes.length}
              </p>
              <p className="text-xs text-stone-500">Dishes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-lg font-bold text-stone-900">
                  {cook.verified ? "< 1 hour" : "< 3 hours"}
                </span>
              </div>
              <p className="text-xs text-stone-500">Avg. Response</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-warm-50 rounded-2xl border border-warm-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-warm-600" />
                Want to message {cook.name?.split(" ")[0]} directly?
              </h3>
              <p className="text-sm text-stone-500">
                Send a message to discuss your event, menu preferences, or ask questions.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/messages/${cook.id}`}>
                <Button size="sm" className="rounded-full bg-warm-700 hover:bg-warm-800 text-white text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Message {cook.name?.split(" ")[0]}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">
            About {cook.name?.split(" ")[0]}
          </h2>
          <p className="text-stone-600 leading-relaxed">{cook.bio}</p>
        </div>

        {/* Pricing */}
        {cook.pricePerHour && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-stone-900 mb-3">Pricing</h2>
            <div className="bg-white rounded-xl border border-stone-100 p-4 inline-flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-sage-500" />
              <div>
                <p className="font-semibold text-stone-900">${cook.pricePerHour}/hour</p>
                <p className="text-xs text-stone-500">Varies by event size and menu complexity</p>
              </div>
            </div>
          </div>
        )}

        <Separator className="mb-10" />

        {/* Signature Dishes */}
        {cook.dishes.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-stone-900 mb-2">Signature Dishes</h2>
            <p className="text-stone-500 mb-6 text-sm">
              A preview of what {cook.name?.split(" ")[0]} can prepare for your event
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cook.dishes.map((dish) => (
                <div key={dish.id} className="bg-white rounded-xl border border-stone-100 overflow-hidden group">
                  <div className="relative h-40 overflow-hidden">
                    {dish.image ? (
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/95 backdrop-blur-sm text-stone-900 font-bold px-2 py-1 rounded-full text-xs">
                        ${dish.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-stone-900 text-sm">{dish.name}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {dish.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dish.preparationTime} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="mb-10" />

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Reviews</h2>
          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={cook.rating} size="md" />
            <span className="text-sm text-stone-500">{cook.reviewCount} reviews</span>
          </div>

          {cook.receivedReviews.length > 0 ? (
            <div className="space-y-4">
              {cook.receivedReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl border border-stone-100 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {review.author.avatar ? (
                        <Image
                          src={review.author.avatar}
                          alt={review.author.name || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm font-medium">
                          {review.author.name?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-stone-900 text-sm">
                          {review.author.name}
                        </h4>
                        <span className="text-xs text-stone-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <StarRating rating={review.rating} showValue={false} />
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">No reviews yet.</p>
          )}
        </div>

        {/* Joined Info */}
        <div className="mt-10 flex items-center gap-2 text-xs text-stone-400">
          <CalendarDays className="w-3.5 h-3.5" />
          Member since {new Date(cook.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}
