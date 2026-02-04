"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createReview(data: {
  targetId: string;
  rating: number;
  comment: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to leave a review" };
  }

  if (data.rating < 1 || data.rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }

  const review = await prisma.review.create({
    data: {
      authorId: session.user.id,
      targetId: data.targetId,
      rating: data.rating,
      comment: data.comment,
    },
  });

  // Update cook's average rating
  const reviews = await prisma.review.findMany({
    where: { targetId: data.targetId },
    select: { rating: true },
  });

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await prisma.user.update({
    where: { id: data.targetId },
    data: {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    },
  });

  return { success: true, reviewId: review.id };
}

export async function getReviews(targetId: string) {
  const reviews = await prisma.review.findMany({
    where: { targetId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
}
