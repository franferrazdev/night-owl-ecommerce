"use client";

import { ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";
import { CartItemRow } from "@/modules/checkout/presentation/components/cart-item-row";

export function CartDrawer() {
  const { items, isOpen, toggleCart, getTotalAmount } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Camada de fechamento ao clicar */}
      <div className="absolute inset-0" onClick={toggleCart} />

      {/* Painel do Carrinho */}
      <div className="relative w-full max-w-md h-full bg-[#0B0F19] border-l border-bs-slate-900 shadow-2xl flex flex-col p-6 animate-slide-in-from-right duration-200">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 text-slate-200">
          <ShoppingCart size={20} className="text-cyan-400" />
          <h2 className="text-lg font-bold tracking-tight">Carrinho</h2>
        </div>
        <button
          onClick={toggleCart}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Área de Itens com Scroll Suave */}
      <div className="flex-1 overflow-y-auto my-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
            <ShoppingCart size={40} className="text-slate-700 stroke-[1.5]" />
            <p className="text-sm text-slate-400 font-medium">
              Seu carrinho está vazio.
            </p>
          </div>
        ) : (
          items.map((item) => <CartItemRow key={item.id} item={item} />)
        )}
      </div>

      {/* Rodapé Transacional com Botão de Ação */}
      {items.length > 0 && (
        <div className="pt-4 border-t border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span>Valor Total:</span>
            <span className="text-xl font-bold text-cyan-400">
              ${getTotalAmount().toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => console.log("Iniciando checkout seguro...")}
            className="w-full py-3 px-4 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-shadow-slate-950 font-bold text-sm tracking-wide rounded-md shadow-[0_0_15px_rgba(34, 211, 238, 0.2)] hover:shadow-[0_0_20px_rgba(34, 211, 238, 0.4)] active:scale-[0.98] transition-all"
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
}
