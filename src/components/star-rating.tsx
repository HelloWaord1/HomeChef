import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function StarRating({
  rating,
  size = "sm",
  showValue = true,
}: StarRatingProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.floor(rating)
                ? "text-amber-400 fill-amber-400"
                : star <= rating
                ? "text-amber-400 fill-amber-200"
                : "text-stone-200 fill-stone-200"
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className={`${textSize} font-medium text-stone-700 ml-0.5`}>
          {rating}
        </span>
      )}
    </div>
  );
}
