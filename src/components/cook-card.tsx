import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { MapPin, ShieldCheck, Navigation } from "lucide-react";

interface CookCardProps {
  cook: {
    id: string;
    name: string;
    slug: string;
    avatar: string;
    coverImage: string;
    bio: string;
    city: string;
    country: string;
    cuisine: string[];
    rating: number;
    reviewCount: number;
    completedEvents: number;
    priceRange: string;
    verified: boolean;
    available: boolean;
  };
  index?: number;
  distance?: number;
}

export function CookCard({ cook, index = 0, distance }: CookCardProps) {
  return (
    <Link href={`/cooks/${cook.slug}`} className="group block">
      <article
        className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200 transition-all duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Cover Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={cook.coverImage}
            alt={`${cook.name}'s kitchen`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Avatar */}
          <div className="absolute -bottom-6 left-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl border-[3px] border-white shadow-md overflow-hidden">
                {cook.avatar ? (
                  <Image
                    src={cook.avatar}
                    alt={cook.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-warm-200 flex items-center justify-center text-warm-700 font-bold">
                    {cook.name[0]}
                  </div>
                )}
              </div>
              {cook.available && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
              )}
            </div>
          </div>

          {/* Cuisine Badges */}
          <div className="absolute top-3 right-3 flex gap-1">
            {cook.cuisine.slice(0, 2).map((c) => (
              <Badge
                key={c}
                className="bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-white border-0 text-[10px] font-medium"
              >
                {c}
              </Badge>
            ))}
          </div>

          {/* Distance Badge */}
          {distance !== undefined && distance !== null && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-warm-600/90 backdrop-blur-sm text-white hover:bg-warm-600 border-0 text-[10px] font-medium">
                <Navigation className="w-2.5 h-2.5 mr-1" />
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pt-8">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-stone-900 group-hover:text-warm-700 transition-colors flex items-center gap-1.5">
              {cook.name}
              {cook.verified && (
                <ShieldCheck className="w-4 h-4 text-sage-500 flex-shrink-0" />
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={cook.rating} />
            <span className="text-xs text-stone-500">({cook.reviewCount})</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-stone-500 font-medium">{cook.priceRange}</span>
          </div>

          <p className="text-sm text-stone-500 line-clamp-2 mb-3 leading-relaxed">
            {cook.bio}
          </p>

          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {cook.city}{cook.country ? `, ${cook.country}` : ""}
            </span>
            <span>{cook.completedEvents} dishes</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
