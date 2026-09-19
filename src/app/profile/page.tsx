"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Package,
  Shield,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/modules/checkout/presentation/store/auth-store";

// Mock de dados de pedidos transacionais
const mockOrders = [
  {
    id: "ord-9821",
    date: "10/09/2026",
    total: 450.0,
    status: "Entregue",
    items: "1x Jaqueta de Couro Midnight",
    statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "ord-7432",
    date: "28/08/2026",
    total: 150.0,
    status: "Em trânsito",
    items: "2x Casaco Premium Midnight Noir",
    statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
];

const emptySubscription = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  const mounted = useSyncExternalStore(
    emptySubscription,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#060B18] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <nav className="w-full bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-900 px-6 py-4 flex items-center justify-center shadow-xs">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan transition-colors"
          >
            <ArrowLeft size={12} />
            Voltar ao Catálogo
          </Link>
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Área do Cliente
          </span>
        </div>
      </nav>

      <main className="w-full max-w-5xl mx-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <section className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center gap-5 transition-colors">
          <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-electric-blue dark:text-electric-cyan shadow-inner">
            <User size={36} className="stroke-[1.5]" />
          </div>

          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
              {user?.name || "Usuário"}
            </h2>
            <span className="text-[9px] font-black text-white dark:text-slate-950 bg-electric-blue dark:bg-electric-cyan px-2 py-0.5 rounded-md uppercase tracking-wider w-fit mx-auto">
              Cliente
            </span>
          </div>

          <div className="w-full flex flex-col gap-3.5 border-t border-slate-100 dark:border-slate-900 pt-4 text-left">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <Mail size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">
                {user?.email || "email@example.com"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <Shield size={14} className="text-slate-400 shrink-0" />
              <span>Conta Verificada</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <CreditCard size={14} className="text-slate-400 shrink-0" />
              <span>···· ···· ···· 9821</span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full mt-2 py-2.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-500 hover:text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut size={13} />
            Sair do Perfil
          </button>
        </section>

        <section className="md:col-span-2 flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Package
                size={16}
                className="text-electric-blue dark:text-electric-cyan"
              />
              Histórico de Pedidos
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Acompanhe o processamento e o status de envio de suas compras
              recentes
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md transition-colors"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {order.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                    {order.items}
                  </p>
                  <span className="text-sm font-black text-electric-blue dark:text-electric-cyan mt-1">
                    R$ {order.total.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border rounded-lg h-fit w-fit ${order.statusColor}`}
                >
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
