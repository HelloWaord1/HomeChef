"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { ComingSoonButton } from "@/components/coming-soon-button";
import { Clock, Users, Plus } from "lucide-react";
import type { Dish } from "@/lib/data";

interface DishCardProps {
  dish: Dish & { cookName?: string; cookSlug?: string };
  index?: number;
}

export function DishCard({ dish, index = 0 }: DishCardProps) {
  const t = useTranslations("dishes");

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200 transition-all duration-300 group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Price */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm text-stone-900 font-bold px-3 py-1.5 rounded-full text-sm shadow-sm">
            ${dish.price}
          </span>
        </div>

        {/* Dietary Badges */}
        {dish.dietary.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {dish.dietary.slice(0, 2).map((d) => (
              <Badge
                key={d}
                variant="secondary"
                className="bg-sage-100/90 backdrop-blur-sm text-sage-700 text-[10px] border-0 font-medium"
              >
                {d}
              </Badge>
            ))}
            {dish.dietary.length > 2 && (
              <Badge
                variant="secondary"
                className="bg-sage-100/90 backdrop-blur-sm text-sage-700 text-[10px] border-0"
              >
                +{dish.dietary.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 mb-1 group-hover:text-warm-700 transition-colors">
          {dish.name}
        </h3>

        {dish.cookName && dish.cookSlug && (
          <Link
            href={`/cooks/${dish.cookSlug}`}
            className="text-xs text-warm-600 hover:text-warm-700 font-medium mb-2 inline-block"
          >
            {t("by")} {dish.cookName}
          </Link>
        )}

        <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed mb-3">
          {dish.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {dish.preparationTime}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {dish.servingSize}
            </span>
          </div>

          <ComingSoonButton
            size="sm"
            className="rounded-full bg-warm-600 hover:bg-warm-700 text-white h-8 px-3 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            {t("add")}
          </ComingSoonButton>
        </div>
      </div>
    </article>
  );
}
