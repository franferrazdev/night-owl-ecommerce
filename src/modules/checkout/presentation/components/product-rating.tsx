"use client";

import { Star, StarHalf } from "lucide-react";

interface ProductRatingProps {
  rating: number;
}

export function ProductRating({ rating }: ProductRatingProps) {
  // Limita a nota ao teto máximo de 5 estrelas
  const safeRating = Math.min(5, Math.max(0, rating));

  // Calcula o número de estrelas completamente preenchidas
  const fullStars = Math.floor(safeRating);

  // Define se deve exibir meia estrela caso a sobra decimal seja maior ou igual a 0.25 e menor que 0.75
  const hasHalfStar = safeRating % 1 >= 0.25 && safeRating % 1 < 0.75;

  // Ajusta o contador caso a sobra decimal arredonde a estrela para cheia
  const adjustedFullStars = safeRating % 1 >= 0.75 ? fullStars + 1 : fullStars;

  // Calcula quantas estrelas vazias restaram para completar o bloco de 5
  const emptyStars = 5 - adjustedFullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className="flex items-center gap-1.5 select-none"
      aria-label={`Avaliação: ${safeRating} de 5 estrelas`}
    >
      <div className="flex items-center text-amber-500 dark:text-amber-400">
        {/* Renderiza as Estrelas Cheias */}
        {Array.from({ length: adjustedFullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={13}
            className="fill-current text-amber-500 dark:text-amber-400 stroke-[1.5]"
          />
        ))}

        {/* Renderiza a Meia Estrela se houver necessidade fracionária */}
        {hasHalfStar && (
          <StarHalf
            size={13}
            className="fill-current text-amber-500 dark:text-amber-400 stroke-[1.5]"
          />
        )}

        {/* Renderiza as Estrelas Vazias */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={13}
            className="text-slate-300 dark:text-slate-700
    stroke-[1.5]"
          />
        ))}
      </div>

      {/* Exibição da nota numérica com precisão de duas casas decimais */}
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 pt-0.5">
        ({safeRating.toFixed(2)})
      </span>
    </div>
  );
}
