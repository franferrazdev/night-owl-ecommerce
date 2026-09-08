"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/modules/checkout/domain/entities/cart-item";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-800">
      <div className="flex items-center gap-3">
        {/* Container Ergonômico de Imagem */}
        <div className="w-16 h-16 rounded-md bg-slate-900 border border-bs-slate-800 flex items-center justify-center overflow-hidden">
          <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">
            Item
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-200 line-clamp-1">
            {item.title}
          </span>
          <span className="text-xs text-cyan-400 font-semibold mt-0.5">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Controles de Quantidade */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-900 border border-bs-slate-800 rounded-md overflow-hidden">
          <button
            onClick={() =>
              updateQuantity(item.id, item.quantity - 1, item.stock)
            }
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
            aria-label="Decrementar quantidade"
          >
            <Minus size={14} />
          </button>
          <span className="px-2 text-xs font-semibold text-slate-300 min-w-5 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              updateQuantity(item.id, item.quantity + 1, item.stock)
            }
            disabled={item.quantity >= item.stock}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors disabled:opacity-30 disabled:bg-transparent"
            aria-label="Incrementar quantidade"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Botão de Exclusão Rápida */}
        <button
          onClick={() => removeItem(item.id)}
          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-colors"
          aria-label="Remover item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
