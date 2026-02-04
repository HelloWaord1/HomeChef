import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CookCard } from "@/components/cook-card";
import { prisma } from "@/lib/prisma";
import {
  Search,
  ChefHat,
  CalendarPlus,
  MessageSquare,
  Handshake,
  ArrowRight,
  Star,
  Shield,
  CreditCard,
  Globe,
  Users,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function HomePage() {
  const dbCooks = await prisma.user.findMany({
    where: { role: "COOK", verified: true },
    include: { dishes: { select: { id: true } } },
    orderBy: { rating: "desc" },
    take: 3,
  });

  const dbEvents = await prisma.event.findMany({
    where: { status: "UPCOMING" },
    include: {
      host: { select: { name: true, avatar: true } },
      bookings: { select: { id: true } },
    },
    orderBy: { date: "asc" },
    take: 3,
  });

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

  const featuredCooks = dbCooks.map((cook) => ({
    id: cook.id,
    name: cook.name || "Unknown Cook",
    slug: cook.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || cook.id,
    avatar: cook.avatar || "",
    coverImage: coverImages[cook.cuisines[0]] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop",
    bio: cook.bio || "",
    city: cook.location?.split(", ")[0] || "Unknown",
    country: cook.location?.split(", ")[1] || "",
    cuisine: cook.cuisines,
    rating: cook.rating,
    reviewCount: cook.reviewCount,
    completedEvents: cook.dishes.length,
    priceRange: cook.pricePerHour ? `$${cook.pricePerHour}/hr` : "Contact",
    verified: cook.verified,
    available: true,
  }));

  const recentEvents = dbEvents.map((event) => ({
    id: event.id,
    title: event.title,
    city: event.location.split(", ").slice(-2, -1)[0] || event.location.split(", ")[0],
    country: event.location.split(", ").pop() || "",
    date: event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: event.date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    maxGuests: event.maxGuests,
    pricePerGuest: event.pricePerGuest,
    cuisine: event.cuisine,
    hostName: event.host.name || "Unknown",
    hostAvatar: event.host.avatar || "",
    bookingCount: event.bookings.length,
  }));

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-warm-50/50 to-cream-100" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-100 text-warm-700 text-xs font-medium mb-6 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-warm-500 animate-pulse" />
                Now live in 8 cities worldwide
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-stone-900 leading-[1.1] mb-6 animate-fade-in-up">
                Hire a home cook
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-600 to-warm-800">
                  for any occasion
                </span>
              </h1>

              <p className="text-lg text-stone-500 leading-relaxed mb-8 animate-fade-in-up animation-delay-100">
                Post your event — dinner party, birthday, date night — and let talented home cooks bid to make it unforgettable. Or browse cooks directly and hire your favorite.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-200">
                <Link href="/events/new" className="flex-1 sm:flex-none">
                  <Button className="w-full sm:w-auto h-12 px-6 rounded-xl bg-warm-700 hover:bg-warm-800 text-white text-sm font-semibold shadow-lg shadow-warm-700/20 hover:shadow-warm-800/30 transition-all">
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Post an Event
                  </Button>
                </Link>
                <Link href="/cooks" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-6 rounded-xl border-stone-300 text-sm font-semibold">
                    <Search className="w-4 h-4 mr-2" />
                    Find a Cook
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 mt-8 animate-fade-in-up animation-delay-300">
                <div className="flex -space-x-2">
                  {["photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d", "photo-1438761681033-6461ffad8d80", "photo-1500648767791-00dcc994a43e"].map((id, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <Image src={`https://images.unsplash.com/${id}?w=64&h=64&fit=crop&crop=face`} alt="" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-stone-500">
                    Trusted by <strong className="text-stone-700">5,000+</strong> hosts &amp; cooks
                  </span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/10 animate-fade-in-up animation-delay-200">
                    <Image src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=500&fit=crop" alt="Chef preparing food" width={400} height={500} className="w-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl animate-fade-in-up animation-delay-400">
                    <Image src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=280&fit=crop" alt="Beautiful food plating" width={400} height={280} className="w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-xl animate-fade-in-up animation-delay-300">
                    <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" alt="Dinner party" width={400} height={300} className="w-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/10 animate-fade-in-up animation-delay-500">
                    <Image src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop" alt="Colorful dishes" width={400} height={400} className="w-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 top-1/3 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3 animate-fade-in animation-delay-600">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">3 new bids</p>
                  <p className="text-[10px] text-stone-500">on your dinner event</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3 mb-4">From idea to feast in three steps</h2>
            <p className="text-stone-500 max-w-lg mx-auto">Whether you&apos;re planning a dinner party for 4 or a celebration for 40, we make it effortless.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: CalendarPlus, title: "Post Your Event", description: "Describe what you need — cuisine, date, guests, budget. Our cooks will compete to win your event." },
              { icon: MessageSquare, title: "Review Bids", description: "Cooks send proposals with their menu ideas and pricing. Compare profiles, reviews, and pick your favorite." },
              { icon: Handshake, title: "Enjoy the Meal", description: "Your cook handles everything. Sit back, enjoy restaurant-quality food at home, and leave a review." },
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6 inline-flex">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    i === 0 ? "bg-warm-100 text-warm-600" : i === 1 ? "bg-sage-100 text-sage-600" : "bg-cream-200 text-cream-500"
                  }`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-stone-400 mb-3">Or skip the bidding —</p>
            <Link href="/cooks">
              <Button variant="outline" className="rounded-full border-stone-200 text-sm">
                Browse &amp; hire a cook directly
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Live Events ─── */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">Live Events</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3">People are looking for cooks</h2>
              <p className="text-stone-500 mt-2">
                Open events waiting for guests.{" "}
                <Link href="/for-cooks" className="text-warm-600 font-medium hover:text-warm-700">Join now →</Link>
              </p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-medium text-warm-700 hover:text-warm-800 transition-colors">
              View all events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event, i) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block">
                <article className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200 transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="h-2 bg-gradient-to-r from-warm-400 to-warm-600" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-stone-900 group-hover:text-warm-700 transition-colors text-lg leading-snug flex-1">{event.title}</h3>
                      <Badge className="bg-warm-50 text-warm-700 border-warm-200 border text-xs font-medium ml-2">{event.cuisine}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Calendar className="w-4 h-4 text-stone-400" /><span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Users className="w-4 h-4 text-stone-400" /><span>{event.maxGuests} people</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <MapPin className="w-4 h-4 text-stone-400" /><span>{event.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <DollarSign className="w-4 h-4 text-stone-400" /><span>${event.pricePerGuest}/person</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        {event.hostAvatar && (
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image src={event.hostAvatar} alt="" width={24} height={24} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="text-xs text-stone-500">{event.hostName}</span>
                      </div>
                      <span className="text-xs text-stone-400">{event.bookingCount} bookings</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/events">
              <Button variant="outline" className="rounded-full border-warm-200 text-warm-700">
                View all events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Cooks ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">Top-Rated Cooks</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3">Hire directly, skip the wait</h2>
            </div>
            <Link href="/cooks" className="hidden sm:flex items-center gap-1 text-sm font-medium text-warm-700 hover:text-warm-800 transition-colors">
              View all cooks
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCooks.map((cook, i) => (
              <CookCard key={cook.id} cook={cook as never} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/cooks">
              <Button variant="outline" className="rounded-full border-warm-200 text-warm-700">
                View all cooks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why HomeChef ─── */}
      <section className="py-24 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">Why choose HomeChef?</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Verified Cooks", description: "Every cook is vetted. Reviews, ratings, and verified experience you can trust." },
              { icon: CreditCard, title: "Flexible Payment", description: "Pay through the app or arrange directly. Fiat and crypto accepted." },
              { icon: Globe, title: "Global Cuisines", description: "Georgian, Japanese, Mexican, French — 200+ cuisines from 10+ countries." },
              { icon: Users, title: "Any Occasion", description: "Dinner for 2 or a party for 50. Cooks who specialize in events of every size." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-sage-100 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-xl bg-sage-100 text-sage-600 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-br from-warm-700 to-warm-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Your next amazing meal<br className="hidden sm:block" /> starts here
          </h2>
          <p className="text-warm-200 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of hosts who&apos;ve discovered the magic of hiring a home cook. Post your first event in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events/new">
              <Button size="lg" className="bg-white text-warm-800 hover:bg-warm-50 rounded-full px-8 text-sm font-semibold shadow-xl">
                Post an Event
                <CalendarPlus className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/for-cooks">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-sm font-semibold">
                I&apos;m a Cook
                <ChefHat className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
