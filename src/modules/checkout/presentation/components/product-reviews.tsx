"use client";

import { Star } from "lucide-react";
import { ProductReview } from "@/modules/checkout/domain/entities/catalog-product";

interface ProductReviewsProps {
  reviews: ProductReview[];
  rating?: number;
}

export function ProductReviews({ reviews, rating }: ProductReviewsProps) {
  return (
    <div className="w-full max-w-5xl bg-white dark:[#0F172A] border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-xl transition-colors mt-8">
      {/* Resumo do Head de Avaliações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900 gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
            Avaliações e Depoimentos
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Veja o que os outros clientes acharam deste produto.
          </p>
        </div>

        {rating && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 px-3 py-1.5 rounded-lg shrink-0 w-fit">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
              {rating.toFixed(1)} / 5.0
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              ({reviews.length} notas)
            </span>
          </div>
        )}
      </div>

      {/* Listagem Dinâmica dos Comentários */}
      {reviews.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">
          Ainda não existem avaliações registradas para este produto.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/60 rounded-xl p-4 flex flex-col gap-2.5 transition-colors"
            >
              {/* Topo do Card de Comentário */}
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {rev.reviewerName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    {new Date(rev.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {/* Estrelas do Usuário */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < rev.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-300 dark:text-slate-800"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Texto do Depoimento */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic pr-2">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
