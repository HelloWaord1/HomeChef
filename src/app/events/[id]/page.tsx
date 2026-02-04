import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { events, getEventById } from "@/lib/data";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  UtensilsCrossed,
  ChefHat,
  Clock,
  MessageSquare,
  Send,
} from "lucide-react";

export function generateStaticParams() {
  return events.map((event) => ({
    id: event.id,
  }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

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
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-warm-400 to-warm-600" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-warm-50 text-warm-700 border-warm-200 border text-xs font-medium">
                    {event.cuisine}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      event.status === "open"
                        ? "border-sage-300 text-sage-700"
                        : "border-warm-300 text-warm-700"
                    }`}
                  >
                    {event.status === "open"
                      ? "🟢 Open"
                      : event.status === "in-progress"
                      ? "🟡 In Progress"
                      : "✅ Completed"}
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden">
                      <Image
                        src={event.postedByAvatar}
                        alt={event.postedBy}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-stone-600">
                      Posted by{" "}
                      <strong className="text-stone-700">
                        {event.postedBy}
                      </strong>
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-stone-400">
                    <Clock className="w-3 h-3" />
                    {event.postedAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {event.city}, {event.country}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {event.address}
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Date & Time
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {event.date}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {mealEmoji} {event.mealType} at {event.time}
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  Group Size
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {event.guestCount} people
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Budget
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  ${event.budgetPerPerson}/person
                </p>
                <p className="text-xs text-warm-600 font-medium mt-0.5">
                  ${event.budgetPerPerson * event.guestCount} total
                </p>
              </div>
            </div>

            {/* Ingredients & Description */}
            <div className="mb-6">
              <Badge
                variant="outline"
                className={`text-xs mb-4 ${
                  event.ingredientProvider === "host"
                    ? "border-sage-300 text-sage-700 bg-sage-50"
                    : "border-warm-200 text-warm-700 bg-warm-50"
                }`}
              >
                <UtensilsCrossed className="w-3 h-3 mr-1" />
                {event.ingredientProvider === "host"
                  ? "Host provides ingredients"
                  : "Cook brings everything"}
              </Badge>

              {event.description && (
                <div className="bg-cream-50 rounded-xl p-5 border border-cream-200">
                  <h3 className="text-sm font-semibold text-stone-700 mb-2">
                    About this event
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* CTA for cooks */}
            <div className="bg-gradient-to-r from-warm-50 to-cream-50 rounded-xl p-5 border border-warm-100 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-stone-800">
                  Are you a cook? Send your proposal!
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Include your proposed menu and pricing
                </p>
              </div>
              <Button className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-6 shadow-md shadow-warm-700/20">
                <Send className="w-4 h-4 mr-2" />
                Submit Bid
              </Button>
            </div>
          </div>
        </div>

        {/* Bids Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-warm-600" />
              Cook Proposals
              <span className="text-sm font-normal text-stone-400">
                ({event.responses.length})
              </span>
            </h2>
          </div>

          {event.responses.length > 0 ? (
            <div className="space-y-4">
              {event.responses.map((bid, i) => (
                <div
                  key={bid.id}
                  className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:border-stone-200 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Cook Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-stone-100">
                        <Image
                          src={bid.cookAvatar}
                          alt={bid.cookName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-900">
                          {bid.cookName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={bid.cookRating} />
                          <span className="text-xs text-stone-500">
                            ({bid.cookReviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-warm-700">
                        ${bid.proposedFee}
                      </p>
                      <p className="text-xs text-stone-400">total</p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-stone-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      &ldquo;{bid.message}&rdquo;
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Submitted {bid.submittedAt}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-stone-200 text-stone-600 text-xs"
                      >
                        Message
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full bg-warm-700 hover:bg-warm-800 text-white text-xs"
                      >
                        Accept Bid
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-100">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-7 h-7 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-1">
                No bids yet
              </h3>
              <p className="text-sm text-stone-500 mb-4">
                This event was just posted. Cooks will start sending proposals
                soon!
              </p>
              <Button className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-6">
                <Send className="w-4 h-4 mr-2" />
                Be the First to Bid
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
