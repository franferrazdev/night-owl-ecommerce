import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";

interface SatisfactionRatingProps {
  rating: number;
  onRatingSelect: (rating: number) => void;
  disabled?: boolean;
}

export function SatisfactionRating({
  rating,
  onRatingSelect,
  disabled = false,
}: SatisfactionRatingProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const starsArray: number[] = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-2 items-center bg-slate-50/50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-100 dark:border-slate-900/60">
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
        {disabled
          ? "Obirgado pelo seu feedback!"
          : "Como foi sua experiência de compra?"}
      </span>
      <div className="flex items-center gap-1.5">
        {starsArray.map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={`text-slate-300 dark:text-slate-700 p-0.5 transition-all ${
              disabled
                ? "cursor-default"
                : "hover:scale-110 active:scale-[0.95] cursor-pointer"
            }`}
            onClick={() => onRatingSelect(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
          >
            <Star
              size={20}
              className={`transition-colors duration-150 ${
                star <= (hoverRating || rating)
                  ? "fill-amber-400 stroke-amber-400 text-amber-400"
                  : "stroke-[1.5]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
