import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { cooks, getCookBySlug } from "@/lib/data";
import {
  MapPin,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  Star,
  CalendarDays,
  Briefcase,
  Clock,
  Zap,
  DollarSign,
} from "lucide-react";
import { CookProfileActions } from "@/components/cook-profile-actions";

interface CookProfilePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return cooks.map((cook) => ({ slug: cook.slug }));
}

export default async function CookProfilePage({
  params,
}: CookProfilePageProps) {
  const { slug } = await params;
  const cook = getCookBySlug(slug);

  if (!cook) {
    notFound();
  }

  return (
    <div className="pt-20 pb-16">
      {/* Cover */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <Image
          src={cook.coverImage}
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
                  src={cook.avatar}
                  alt={cook.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              {cook.available && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 border-3 border-white rounded-full" />
              )}
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
                {cook.cuisine.map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="bg-warm-100 text-warm-700 border-0 text-xs"
                  >
                    {c}
                  </Badge>
                ))}
                <Badge
                  variant="secondary"
                  className="bg-sage-50 text-sage-700 border-0 text-xs"
                >
                  <Briefcase className="w-2.5 h-2.5 mr-1" />
                  {cook.experienceLevel}
                </Badge>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {cook.city}, {cook.country}
                </span>
              </div>
            </div>

            <CookProfileActions />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
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
                {cook.completedEvents}
              </p>
              <p className="text-xs text-stone-500">Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900 mb-1">
                {cook.responseRate}
              </p>
              <p className="text-xs text-stone-500">Response Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-lg font-bold text-stone-900">
                  {cook.responseTime}
                </span>
              </div>
              <p className="text-xs text-stone-500">Avg. Response</p>
            </div>
          </div>
        </div>

        {/* Contact/Subscribe CTA */}
        <div className="bg-warm-50 rounded-2xl border border-warm-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-warm-600" />
                Want to message {cook.name.split(" ")[0]} directly?
              </h3>
              <p className="text-sm text-stone-500">
                Subscribe for unlimited messaging, or buy this cook&apos;s
                contact for a one-time fee.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs border-warm-200"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  $4.99 one-time
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="sm"
                  className="rounded-full bg-warm-700 hover:bg-warm-800 text-white text-xs"
                >
                  Subscribe — $14.99/mo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">
            About {cook.name.split(" ")[0]}
          </h2>
          <p className="text-stone-600 leading-relaxed">{cook.bio}</p>
        </div>

        {/* Pricing */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">
            Pricing
          </h2>
          <div className="bg-white rounded-xl border border-stone-100 p-4 inline-flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-sage-500" />
            <div>
              <p className="font-semibold text-stone-900">{cook.priceRange}</p>
              <p className="text-xs text-stone-500">
                Varies by event size and menu complexity
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-10" />

        {/* Signature Dishes */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-stone-900 mb-2">
            Signature Dishes
          </h2>
          <p className="text-stone-500 mb-6 text-sm">
            A preview of what {cook.name.split(" ")[0]} can prepare for your
            event
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cook.dishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-xl border border-stone-100 overflow-hidden group"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {dish.dietary.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {dish.dietary.map((d) => (
                        <Badge
                          key={d}
                          className="bg-sage-100/90 backdrop-blur-sm text-sage-700 text-[9px] border-0"
                        >
                          {d}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-stone-900 text-sm">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-10" />

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Reviews</h2>
          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={cook.rating} size="md" />
            <span className="text-sm text-stone-500">
              {cook.reviewCount} reviews
            </span>
          </div>

          <div className="space-y-4">
            {cook.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-stone-100 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={review.avatar}
                      alt={review.author}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-stone-900 text-sm">
                        {review.author}
                      </h4>
                      <span className="text-xs text-stone-400">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} showValue={false} />
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-stone-50 text-stone-500 border-0"
                      >
                        {review.eventType}
                      </Badge>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Joined Info */}
        <div className="mt-10 flex items-center gap-2 text-xs text-stone-400">
          <CalendarDays className="w-3.5 h-3.5" />
          Member since {cook.joinedDate}
        </div>
      </div>
    </div>
  );
}
