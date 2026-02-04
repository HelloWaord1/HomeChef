import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const role = (session.user as { role?: string }).role;

  if (role === "COOK") {
    return <CookReviews userId={userId} />;
  }

  return <CustomerReviews userId={userId} />;
}

async function CookReviews({ userId }: { userId: string }) {
  const [user, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true, reviewCount: true },
    }),
    prisma.review.findMany({
      where: { targetId: userId },
      include: {
        author: { select: { name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    stars: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Reviews</h1>
        <p className="text-stone-500 text-sm mt-1">
          What your customers are saying
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="text-center sm:text-left">
            <p className="text-4xl font-bold text-stone-900">
              {user?.rating?.toFixed(1) || "0.0"}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-0.5 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(user?.rating || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-stone-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-stone-400">
              {user?.reviewCount || 0} reviews
            </p>
          </div>

          <div className="flex-1 space-y-1.5">
            {ratingDist.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-xs text-stone-500 w-3">{stars}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{
                      width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5"
            >
              <div className="flex items-start gap-3">
                {review.author.avatar ? (
                  <img
                    src={review.author.avatar}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500 flex-shrink-0">
                    {review.author.name?.[0] || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-stone-900 text-sm">
                      {review.author.name}
                    </p>
                    <span className="text-xs text-stone-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function CustomerReviews({ userId }: { userId: string }) {
  const reviews = await prisma.review.findMany({
    where: { authorId: userId },
    include: {
      target: {
        select: { name: true, avatar: true, cuisines: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">My Reviews</h1>
        <p className="text-stone-500 text-sm mt-1">
          Reviews you&apos;ve written — {reviews.length} total
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400">You haven&apos;t written any reviews yet</p>
          <p className="text-xs text-stone-300 mt-1">
            After a booking is completed, you can leave a review for the cook
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5"
            >
              <div className="flex items-start gap-3">
                {review.target.avatar ? (
                  <img
                    src={review.target.avatar}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500 flex-shrink-0">
                    {review.target.name?.[0] || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-900 text-sm">
                        {review.target.name}
                      </p>
                      {review.target.cuisines?.[0] && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 bg-warm-50 text-warm-700"
                        >
                          {review.target.cuisines[0]}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
