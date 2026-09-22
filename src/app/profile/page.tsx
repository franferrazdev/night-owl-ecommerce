"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Package,
  Shield,
  CreditCard,
  LogOut,
  Package2,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/modules/checkout/presentation/store/auth-store";
import {
  fetchUserOrders,
  PreparedOrder,
} from "@/modules/profile/infra/services/fetch-user-orders";
import { OrderStatus } from "@/modules/checkout/domain/order-status";

export const dynamic = "force-dynamic";

// Dicionário auxiliar para traduzir o status do banco para a UI
const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "PREPARING":
      return "Preparando";
    case "SHIPPED":
      return "Enviado";
    case "DELIVERED":
      return "Entregue";
    case "CONFIRMED":
      return "Recebido";
    case "REVIEWING":
      return "Avaliar";
    case "REVIEWED":
      return "Concluído";
    default:
      return status;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PREPARING":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "SHIPPED":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "DELIVERED":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "CONFIRMED":
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    case "REVIEWING":
      return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case "REVIEWED":
      return "text-slate-950 bg-emerald-500 border-transparent font-black";
    default:
      return "text-slate-400 bg-slate-500/10 border-slate-500/20";
  }
};

const emptySubscription = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  // Estados locais dinâmicos para controlar loaders
  const [orders, setOrders] = useState<PreparedOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const mounted = useSyncExternalStore(
    emptySubscription,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!mounted) return;

    async function loadOrders() {
      try {
        setIsLoading(true);
        // Alinha com o "user-sandbox-01" persistido pelo CartDrawer
        const data = await fetchUserOrders("user-sandbox-01");
        setOrders(data);
      } catch (error) {
        console.error("Falha ao recuperar histórico:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [mounted]);

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

      {/* Dados Cadastrais do Cliente */}
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
              <span>···· ···· ···· 4242</span>
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

        {/* Histórico Logístico Atômico */}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Carregando registros do Prisma...
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#0F172A] p-6 gap-3">
                <Package2
                  size={36}
                  className="text-slate-300 dark:text-slate-700 stroke-[1.2]"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Nenhum faturamento registrado na sua conta.
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const safeStatus = (
                  order.status || "PREPARING"
                ).toUpperCase() as OrderStatus;
                const displayLabel =
                  safeStatus === "REVIEWED"
                    ? "Avaliado"
                    : getStatusLabel(safeStatus);
                const firstItem = order.items[0];

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md transition-colors"
                  >
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      {firstItem?.thumbnail && (
                        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-950 p-2 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={firstItem.thumbnail}
                            alt={firstItem.title}
                            className="object-contain max-w-full max-h-full"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-0.5 min-w-0">
                        {firstItem ? (
                          <Link
                            href={`/product/${firstItem.productId}`}
                            className="text-sm font-black text-slate-800 dark:text-slate-100 hover:text-electric-blue dark:hover:text-electric-cyan transition-colors truncate block max-w-xs md:max-w-md"
                          >
                            {firstItem.quantity > 1
                              ? `${firstItem.quantity}x `
                              : ""}
                            {firstItem.title}
                          </Link>
                        ) : (
                          <span className="text-xs font-black text-slate-400">
                            Produto indisponível
                          </span>
                        )}

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-wider">
                            {order.trackingCode}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            ·{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>

                        <span className="text-sm font-black text-electric-blue dark:text-electric-cyan mt-1 block">
                          R$ {order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border rounded-lg h-fit w-fit ${getStatusColor(safeStatus)}`}
                      >
                        {displayLabel}
                      </div>

                      {safeStatus === "REVIEWED" ? (
                        <button
                          disabled
                          className="p-2 rounded-md border border-slate-100 dark:border-slate-900 text-slate-300 dark:text-slate-700 bg-slate-50/20 dark:bg-slate-950/20 opacity-50 cursor-not-allowed"
                          title="Fluxo de rastreamento concluído"
                        >
                          <ExternalLink size={12} />
                        </button>
                      ) : (
                        <Link
                          href={`/order/success?productId=${order.items[0]?.productId || "1"}&trackingCode=${order.trackingCode}`}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan transition-colors bg-slate-50/50 dark:bg-slate-950/40"
                          title="Acompanhar Rastreamento"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
