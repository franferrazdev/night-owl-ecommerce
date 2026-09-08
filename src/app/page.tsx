"use client";

import { useEffect } from "react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";
import { CartDrawer } from "@/modules/checkout/presentation/components/cart-drawer";
import { CartItemRow } from "@/modules/checkout/presentation/components/cart-item-row";

export default function TemporaryPreviewPage() {
  const { toggleCart, addItem, items } = useCartStore();

  // Injeta automaticamente um item simulado para teste visual assim que a página carrega
  useEffect(() => {
    // Limpa para não ficar duplicando a cada refresh de desenvolvimento
    useCartStore.getState().clearCart();

    addItem({
      id: "prod-owl-1",
      externalId: 101,
      title: "Night Owl Cyber Bomber Jacket - Velvet Edition",
      price: 89.9,
      stock: 5,
    });
  }, [addItem]);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-6 gap-6 font-sans">
      {/* Cabeçalho do Conceito */}
      <div className="text-center max-w-md flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-wider bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          NIGHT OWL E-COMMERCE
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Visualização temporárea do ecossistema de estilos ergonômicos e
          componentes transacionais de borda.
        </p>
      </div>

      {/* Box de Teste do CartItemRow Individual */}
      <div className="w-full max-w-sm bg-[#0F16626] border border-b-slate-900 rounded-xl p-5 shadow-xl flex flex-col gap-1">
        <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase mb-2">
          Preview: CartItemRowComponent
        </span>
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Botão Magnético Néon para Abrir o Painel Lateral */}
      <button
        onClick={toggleCart}
        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-400 font-semibold text-xs tracking-widest uppercase rounded-lg shadow-[0_-_15px_rgba(34, 211, 238, 0.1)] hover:shadow-[0_0_20px_rgba(34, 211, 238, 0.25)] transition-all duration-200 active:scale-95"
      >
        Abrir Sacola / Ver Drawer Lateral
      </button>

      {/* O Painel Lateral Injetado na Árvore Visual */}
      <CartDrawer />
    </main>
  );
}
