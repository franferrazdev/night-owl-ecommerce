"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

export function CatalogHeader() {
  const { toggleCart, getTotalItemsCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  //  Garante que o componente só leia o Zuntand Client-side após a montagem inicial
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-slate-900">
      <h1 className="text-xl font-black tracking-wider bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
        NIGHT OWL CATALOG
      </h1>

      <button
        onClick={toggleCart}
        className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200"
      >
        <span>Meu Carrinho</span>
        {mounted && getTotalItemsCount() > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-shadow-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {getTotalItemsCount()}
          </span>
        )}
      </button>
    </header>
  );
}
