import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  UtensilsCrossed,
  MessageSquare,
  Clock,
} from "lucide-react";
import type { CookingEvent } from "@/lib/data";

interface EventCardProps {
  event: CookingEvent;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const mealEmoji =
    event.mealType === "Breakfast"
      ? "🌅"
      : event.mealType === "Lunch"
      ? "☀️"
      : event.mealType === "Dinner"
      ? "🌙"
      : event.mealType === "Party"
      ? "🎉"
      : "✨";

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article
        className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200 transition-all duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Top color bar */}
        <div className="h-2 bg-gradient-to-r from-warm-400 to-warm-600" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-stone-900 group-hover:text-warm-700 transition-colors text-lg leading-snug">
                {event.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-stone-500">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {event.city}, {event.country}
                </span>
              </div>
            </div>
            <Badge className="bg-warm-50 text-warm-700 border-warm-200 border text-xs font-medium ml-2 flex-shrink-0">
              {event.cuisine}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-base leading-none">{mealEmoji}</span>
              <span>{event.mealType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Users className="w-4 h-4 text-stone-400" />
              <span>
                {event.guestCount}{" "}
                {event.guestCount === 1 ? "person" : "people"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <DollarSign className="w-4 h-4 text-stone-400" />
              <span>${event.budgetPerPerson}/person</span>
            </div>
          </div>

          {/* Ingredients Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className={`text-xs ${
                event.ingredientProvider === "host"
                  ? "border-sage-300 text-sage-700 bg-sage-50"
                  : "border-stone-200 text-stone-500"
              }`}
            >
              <UtensilsCrossed className="w-3 h-3 mr-1" />
              {event.ingredientProvider === "host"
                ? "Ingredients provided"
                : "Cook brings everything"}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={event.postedByAvatar}
                  alt={event.postedBy}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-stone-500">{event.postedBy}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-stone-400">
                <MessageSquare className="w-3 h-3" />
                {event.responses.length}{" "}
                {event.responses.length === 1 ? "bid" : "bids"}
              </span>
              <span className="flex items-center gap-1 text-xs text-stone-400">
                <Clock className="w-3 h-3" />
                {event.postedAt}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
