import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  CalendarDays,
  DollarSign,
  Star,
  TrendingUp,
  UtensilsCrossed,
  ChefHat,
  Clock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function EmailVerificationBanner({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  if (user?.emailVerified) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-800">Email not verified</p>
        <p className="text-xs text-amber-600">Please verify your email address to unlock all features.</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const role = (session.user as { role?: string }).role;

  if (role === "COOK") {
    return (
      <>
        <EmailVerificationBanner userId={userId} />
        <CookDashboard userId={userId} name={session.user.name || "Chef"} />
      </>
    );
  }

  return (
    <>
      <EmailVerificationBanner userId={userId} />
      <CustomerDashboard userId={userId} name={session.user.name || "User"} />
    </>
  );
}

async function CookDashboard({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const [user, bookings, dishes, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true, reviewCount: true },
    }),
    prisma.booking.findMany({
      where: { cookId: userId },
      include: {
        customer: { select: { name: true, avatar: true } },
        dish: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.dish.count({ where: { cookId: userId } }),
    prisma.review.findMany({
      where: { targetId: userId },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const totalEarnings = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.total, 0);
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Welcome back, {name.split(" ")[0]} 👨‍🍳
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with your cook profile
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CalendarDays className="w-5 h-5 text-blue-600" />}
          label="Total Bookings"
          value={bookings.length.toString()}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          label="Earnings"
          value={`$${totalEarnings.toFixed(0)}`}
          bg="bg-green-50"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-amber-500" />}
          label="Rating"
          value={user?.rating?.toFixed(1) || "0.0"}
          sub={`${user?.reviewCount || 0} reviews`}
          bg="bg-amber-50"
        />
        <StatCard
          icon={<UtensilsCrossed className="w-5 h-5 text-warm-600" />}
          label="Active Dishes"
          value={dishes.toString()}
          bg="bg-warm-50"
        />
      </div>

      {/* Pending Action */}
      {pendingBookings > 0 && (
        <div className="bg-warm-50 border border-warm-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warm-700" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">
                {pendingBookings} pending{" "}
                {pendingBookings === 1 ? "booking" : "bookings"}
              </p>
              <p className="text-sm text-stone-500">
                Review and respond to incoming requests
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-warm-700 hover:bg-warm-800 text-white rounded-full"
          >
            <Link href="/dashboard/bookings">
              Review <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">Recent Bookings</h2>
            <Link
              href="/dashboard/bookings"
              className="text-xs text-warm-700 hover:text-warm-800 font-medium"
            >
              View all →
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">
              No bookings yet
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {booking.customer.avatar ? (
                      <img
                        src={booking.customer.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-500">
                        {booking.customer.name?.[0] || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        {booking.customer.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {booking.dish?.name || "Custom booking"} ·{" "}
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">Recent Reviews</h2>
            <Link
              href="/dashboard/reviews"
              className="text-xs text-warm-700 hover:text-warm-800 font-medium"
            >
              View all →
            </Link>
          </div>
          {reviews.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">
              No reviews yet
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="py-2 border-b border-stone-50 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400">
                      by {review.author.name}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-2">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <h2 className="font-semibold text-stone-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/dishes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-100 hover:border-warm-200 hover:bg-warm-50/50 transition-colors"
          >
            <UtensilsCrossed className="w-5 h-5 text-warm-600" />
            <span className="text-sm font-medium text-stone-700">
              Manage Dishes
            </span>
          </Link>
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-100 hover:border-warm-200 hover:bg-warm-50/50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-warm-600" />
            <span className="text-sm font-medium text-stone-700">
              Messages
            </span>
          </Link>
          <Link
            href="/events/new"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-100 hover:border-warm-200 hover:bg-warm-50/50 transition-colors"
          >
            <ChefHat className="w-5 h-5 text-warm-600" />
            <span className="text-sm font-medium text-stone-700">
              Create Event
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

async function CustomerDashboard({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const [bookings, reviews] = await Promise.all([
    prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        cook: { select: { name: true, avatar: true, rating: true } },
        dish: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.review.findMany({
      where: { authorId: userId },
      include: { target: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  // Get "favorite" cooks — cooks with the most bookings
  const cookBookingCounts = bookings.reduce(
    (acc, b) => {
      acc[b.cookId] = (acc[b.cookId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const favoriteCooks = Object.entries(cookBookingCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cookId]) => bookings.find((b) => b.cookId === cookId)?.cook)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Welcome back, {name.split(" ")[0]} 👋
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Discover amazing home-cooked meals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<CalendarDays className="w-5 h-5 text-blue-600" />}
          label="Total Bookings"
          value={bookings.length.toString()}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-amber-500" />}
          label="Reviews Given"
          value={reviews.length.toString()}
          bg="bg-amber-50"
        />
        <StatCard
          icon={<ChefHat className="w-5 h-5 text-warm-600" />}
          label="Favorite Cooks"
          value={favoriteCooks.length.toString()}
          bg="bg-warm-50"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">Recent Bookings</h2>
            <Link
              href="/dashboard/bookings"
              className="text-xs text-warm-700 hover:text-warm-800 font-medium"
            >
              View all →
            </Link>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="w-10 h-10 text-stone-200 mx-auto mb-3" />
              <p className="text-sm text-stone-400">No bookings yet</p>
              <Button
                asChild
                size="sm"
                className="mt-3 bg-warm-700 hover:bg-warm-800 text-white rounded-full"
              >
                <Link href="/cooks">Browse Cooks</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {booking.cook.avatar ? (
                      <img
                        src={booking.cook.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-500">
                        {booking.cook.name?.[0] || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        {booking.cook.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {booking.dish?.name || "Custom booking"} ·{" "}
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Cooks */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">Favorite Cooks</h2>
            <Link
              href="/cooks"
              className="text-xs text-warm-700 hover:text-warm-800 font-medium"
            >
              Browse all →
            </Link>
          </div>
          {favoriteCooks.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-10 h-10 text-stone-200 mx-auto mb-3" />
              <p className="text-sm text-stone-400">
                Book a cook to see favorites
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteCooks.map((cook, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0"
                >
                  {cook?.avatar ? (
                    <img
                      src={cook.avatar}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500">
                      {cook?.name?.[0] || "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {cook?.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-stone-500">
                        {cook?.rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <h2 className="font-semibold text-stone-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/cooks"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-100 hover:border-warm-200 hover:bg-warm-50/50 transition-colors"
          >
            <ChefHat className="w-5 h-5 text-warm-600" />
            <span className="text-sm font-medium text-stone-700">
              Find a Cook
            </span>
          </Link>
          <Link
            href="/events"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-100 hover:border-warm-200 hover:bg-warm-50/50 transition-colors"
          >
            <CalendarDays className="w-5 h-5 text-warm-600" />
            <span className="text-sm font-medium text-stone-700">
              Browse Events
            </span>
          </Link>
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-100 hover:border-warm-200 hover:bg-warm-50/50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-warm-600" />
            <span className="text-sm font-medium text-stone-700">
              Messages
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <p className="text-xs text-stone-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-stone-50 text-stone-500 border-stone-200",
  };

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-medium ${styles[status] || styles.PENDING}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
