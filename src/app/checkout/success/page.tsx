"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

export default function SuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { clearCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
    // Recupera o ID gerado pelo servidor simulado e limpa a sessão em seguida
    const savedId = sessionStorage.getItem("last_order_id");
    setOrderId(savedId || "owl-order-0000");

    return () => {
      sessionStorage.removeItem("last_order_id");
    };
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#060B18] text-slate-900 dark:text-slate-100 font-sans flex items-center justify-center p-6 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 text-center transition-colors">
        <div className="w-14 h-1/4 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
          <CheckCircle2 size={32} className="stroke-[1.5]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Pedido Confirmado com sucesso!
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed px-2">
            Seu pagamento foi processado sob o protocolo de segurança Night Owl.
            O comprovante foi enviado ao seu e-mail cadastrado.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-1 transition-colors">
          <span className="text-[9px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
            Código do Localizador
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase font-mono">
            {orderId}
          </span>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <Link
            href="/"
            className="w-full py-3.5 bg-electric-blue hover:bg-electric-vivid text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
          >
            <ShoppingCart size={13} />
            <span>Continuar Comprando</span>
          </Link>

          <Link
            href="/profile"
            className="text-xs font-bold text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
          >
            <span>Ver Meus Pedidos</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
