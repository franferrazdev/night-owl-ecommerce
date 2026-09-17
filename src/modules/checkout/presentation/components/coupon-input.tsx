"use client";

import React, { useState } from "react";
import { Ticket, X } from "lucide-react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";
import { toast } from "react-hot-toast";

// Dicionário de cupons válidos na plataforma sandbox
const VALID_COUPONS: Record<string, number> = {
  NIGHTOWL10: 10,
  NIGHTOWL20: 20,
};

export function CouponInput() {
  const { activeCoupon, applyCoupon, removeCoupon, items } = useCartStore();
  const [inputValue, setInputValue] = useState("");

  if (items.length === 0) return null;

  const handleApply = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const codeUpper = inputValue.trim().toUpperCase();

    if (!codeUpper) return;
    if (VALID_COUPONS[codeUpper] !== undefined) {
      const percentage = VALID_COUPONS[codeUpper];
      applyCoupon(codeUpper, percentage);
      toast.success(
        `Cupom ${codeUpper} de ${percentage}% aplicado com sucesso!`,
      );
      setInputValue("");
    } else {
      toast.error("Cupom inválido ou expirado.");
    }
  };

  return (
    <div className="w-full border-t border-slate-100 dark:border-slate-900 pt-4 flex flex-col gap-3">
      <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase pl-0.5 flex items-center gap-1.5">
        <Ticket size={12} />
        Cupom de Desconto
      </label>

      {activeCoupon ? (
        // Mostra o cupom já ativo com o botão de deleção
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl p-3 text-xs font-bold transition-all">
          <div className="flex flex-col gap-0.5">
            <span className="tracking-wide uppercase font-mono">
              {activeCoupon.code}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-medium">
              Desconto de {activeCoupon.discountPercentage}% ativo
            </span>
          </div>
          <button
            type="submit"
            onClick={() => {
              removeCoupon();
              toast.success("Cupom promocional removido.");
            }}
            className="p-1.5 hover:bg-emerald-500/10 rounded-md transition-colors cursor-pointer text-emerald-500"
            aria-label="Remover cupom"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        // Formulário de entrada controlado
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex.: NIGHTOWL10"
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-xl text-xs outline-hidden uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 hover:border-electric-blue dark:hover:border-electric-cyan text-white dark:text-slate-300 dark:hover:text-electric-cyan text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Aplicar
          </button>
        </form>
      )}

      {/* Dica para testes */}
      {!activeCoupon && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pl-0.5">
          Dica para testes: Use os cupons{" "}
          <span className="font-bold font-mono text-slate-500 dark:text-slate-400">
            NIGHTOWL10
          </span>{" "}
          ou{" "}
          <span className="font-bold font-mono text-slate-500 dark:text-slate-400">
            NIGHTOWL20
          </span>
        </span>
      )}
    </div>
  );
}
