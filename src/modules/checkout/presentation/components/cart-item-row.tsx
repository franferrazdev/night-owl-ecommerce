"use client";

import { MouseEvent } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/modules/checkout/domain/entities/cart-item";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleDecrement = (e: MouseEvent<HTMLButtonElement>) => {
    // Trava de Segurança Clicável: Impede o evento de subir na árvore DOM e fechar o carrinho
    e.stopPropagation();
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1, item.stock);
    }
  };

  const handleIncrement = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1, item.stock);
    }
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeItem(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-slate-800 last:border-none w-full">
      {/* Bloco de Imagem e Textos */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Container de Imagem */}
        <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center overflow-hidden p-1 shrink-0">
          {item.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnail}
              alt={item.title}
              className="object-contain max-w-full max-h-full"
              loading="lazy"
            />
          ) : (
            <span className="text-[10px] text-slate-600 font-bold tracking-wider uppercase">
              Item
            </span>
          )}
        </div>

        {/* Informações Textuais */}
        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <h4 className="text-xs font-semibold text-slate-200 truncate pr-2">
            {item.title}
          </h4>
          <span className="text-xs text-cyan-400 fontbold">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Controles de AÇão e Exclusão */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-bs-slate-900/50 sm:border-none">
        {/* Seletores de Quantidade */}
        <div className="flex items-center bg-slate-950 border border-bs-slate-900 rounded-lg overflow-hidden pt-0.5">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900/50 transition-colors disabled:opacity-20 cursor-pointer"
            aria-label="Decrementar quantidade"
          >
            <Minus size={12} />
          </button>
          <span className="px-2 text-xs font-bold text-slate-300 min-w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= item.stock}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900/50 transition-colors disabled:opacity-20 cursor-pointer"
            aria-label="Incrementar quantidade"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Botão de Exclusão */}
        <button
          onClick={handleRemove}
          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Remover item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
