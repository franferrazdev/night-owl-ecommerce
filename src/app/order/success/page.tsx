"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderStatus } from "@/modules/checkout/domain/order-status";
import { DeliveryStepper } from "@/modules/checkout/presentation/components/delivery-stepper";
import { SatisfactionRating } from "@/modules/checkout/presentation/components/satisfaction-rating";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  MessageSquare,
  ShieldCheck,
  ShoppingCart,
  StarHalf,
} from "lucide-react";
import { updateOrderStatus } from "@/modules/checkout/infra/services/update-order-status";
import { fetchUserOrders } from "@/modules/profile/infra/services/fetch-user-orders";

const emptySubscription = () => () => {};

const getOrderId = () => {
  if (typeof window === "undefined") {
    return "owl-order-0000";
  }

  return sessionStorage.getItem("last_order_id") || "owl-order-0000";
};

const getPurchasedProductId = (): string => {
  if (typeof window === "undefined") {
    return "1";
  }
  return sessionStorage.getItem("last_purchased_product_id") || "1";
};

const getServerValue = (): string => "1";
const getServerOrderId = () => "owl-order-0000";

export default function SuccessPage() {
  const orderId = useSyncExternalStore(
    emptySubscription,
    getOrderId,
    getServerOrderId,
  );

  // Captura dados do produto
  const searchParams = useSearchParams();
  const router = useRouter(); // Inicializa o roteador no Next.js
  const urlProductId = searchParams.get("productId");

  const storeProductId = useSyncExternalStore(
    emptySubscription,
    getPurchasedProductId,
    getServerValue,
  );

  const productId = urlProductId || storeProductId;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("PREPARING");
  const [rating, setRating] = useState<number>(0);

  // Estados para gerenciar o rastreador aleatório e feedback de cópia
  const [trackingCode, setTrackingCode] = useState<string>("BR-000000");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    async function initializeAndCheckStatus() {
      // Captura o trackingCode vindo da URL se o usuário veio da tela de perfil
      const urlTrackingCode = searchParams.get("trackingCode");
      // Recupera ou define de forma consistente o código localizador
      const storedCode = sessionStorage.getItem("active_tracking_code");

      let activeCode = urlTrackingCode || storedCode;

      if (!activeCode) {
        // Inicializa o trackingCode único gerado na sessão
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        activeCode = `BR-${randomDigits}`;
        sessionStorage.setItem("active_tracking_code", activeCode);
      } else {
        // Alinha a sessão com o código aberto do histórico
        sessionStorage.setItem("active_tracking_code", activeCode);
      }

      if (isMounted) setTrackingCode(activeCode);
      try {
        // Verifica o estado real do pedido salvo no Supabase
        const userOrders = await fetchUserOrders("user-sandbox-01");
        const currentOrderInDb = userOrders.find(
          (o) => o.trackingCode === activeCode,
        );

        if (currentOrderInDb) {
          if (isMounted) setCurrentStatus(currentOrderInDb.status);

          // Se o pedido já avançou além do estágio automático, bloqueia o re-disparo dos timers
          const blockList: OrderStatus[] = [
            "DELIVERED",
            "CONFIRMED",
            "REVIEWING",
            "REVIEWED",
          ];
          if (blockList.includes(currentOrderInDb.status)) {
            return;
          }
        }
      } catch (error) {
        console.error("Falha ao ler registros de faturamento na nuvem:", error);
      }

      // Sandbox Automation - Atualiza a interface E grava as transições no Supabase de forma autônoma
      timer1 = setTimeout(() => {
        if (!isMounted) return;
        setCurrentStatus("SHIPPED");
        toast.success(
          "Logística: O seu pedido foi despachado e está a caminho!",
        );

        // Persiste o estado Enviado no banco automaticamente
        updateOrderStatus(activeCode!, "SHIPPED").catch(console.error);
      }, 4000);

      timer2 = setTimeout(() => {
        if (!isMounted) return;
        setCurrentStatus("DELIVERED");
        toast.success(
          "Logística: Pacote entregue! Por favor, confirme o recebimento.",
        );

        // Persiste o estado Entregue no banco automaticamente
        updateOrderStatus(activeCode!, "DELIVERED").catch(console.error);
      }, 8000);
    }
    initializeAndCheckStatus();

    return () => {
      isMounted = false;
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, [orderId, searchParams]);

  // Função nativa para copiar o texto para a área de transferência do usuário
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      toast.success("Código copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Falha ao copiar o código automaticamente.");
    }
  };

  // Usuário clica em Confirmar Recebimento -> Vai para CONFIRMED
  const handleConfirmDelivery = async () => {
    if (currentStatus === "DELIVERED") {
      setCurrentStatus("CONFIRMED");
      toast.success(
        "Sucesso: Recebimento confirmado! Clique em Avaliar para prosseguir.",
      );

      // Persiste o estado CONFIRMED no Supabase
      await updateOrderStatus(trackingCode, "CONFIRMED");
    }
  };

  // Usuário clica em Avaliar Pedido -> Avança para a etapa de preenchimento (REVIEWING)
  const handleGoToReviewStage = async () => {
    if (currentStatus === "CONFIRMED") {
      setCurrentStatus("REVIEWING");

      // Persiste o estado REVIEWING no Supabase
      await updateOrderStatus(trackingCode, "REVIEWING");
    }
  };

  // Usuário vota localmente pelas estrelas -> Completa a etapa REVIEWED
  const handleLocalRating = async (selectedStars: number) => {
    setRating(selectedStars);
    setCurrentStatus("REVIEWED"); // Avança para a última etapa automaticamente
    toast.success(`Obrigado pela nota de ${selectedStars} estrelas!`);

    // Persiste o estado final de conclusão no Supabase
    await updateOrderStatus(trackingCode, "REVIEWED");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#060B18] text-slate-900 dark:text-slate-100 font-sans flex items-center justify-center p-6 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 text-center transition-colors">
        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
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

        {/* Botão interativo de clique para copiar o código gerado dinamicamente */}
        <button
          type="button"
          onClick={handleCopyCode}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-1 items-center justify-center transition-all cursor-pointer group active:scale-[0.98] hover:border-slate-300 dark:hover:border-slate-700"
        >
          <span className="text-[9px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
            Código do Localizador
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase font-mono">
              {trackingCode}
            </span>
            {copied ? (
              <Check size={14} className="text-emerald-500 transition-colors" />
            ) : (
              <Copy
                size={14}
                className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
              />
            )}
          </div>
        </button>

        {/* Rastreamento Linear */}
        <DeliveryStepper currentStatus={currentStatus} />

        {/* Portão Visual de Avaliação */}
        {(currentStatus === "REVIEWING" || currentStatus === "REVIEWED") && (
          <>
            {/* Formulário de Satisfação */}
            <SatisfactionRating
              rating={rating}
              onRatingSelect={handleLocalRating}
              disabled={currentStatus === "REVIEWED"}
            />
          </>
        )}

        {/* UX Gates e Botões */}
        <div className="flex flex-col gap-3 mt-2">
          {/*Botão de confirmação manual (Exibido em DELIVERED) */}
          {currentStatus === "DELIVERED" && (
            <button
              onClick={handleConfirmDelivery}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            >
              <ShieldCheck size={14} />
              <span>Confirmar Recebimento</span>
            </button>
          )}

          {/* Botão de transição para a etapa avaliar */}
          {currentStatus === "CONFIRMED" && (
            <button
              onClick={handleGoToReviewStage}
              className="w-full py-3.5 bg-electric-blue hover:bg-electric-vivid text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            >
              <MessageSquare size={14} />
              <span>Avaliar Pedido</span>
            </button>
          )}

          {/* Botão externo de redirecionamento */}
          {currentStatus === "REVIEWING" && (
            <Link
              href={`/product/${productId}?review=true#reviews-form`}
              onClick={async () => {
                setCurrentStatus("REVIEWED");
                sessionStorage.removeItem("last_purchased_product_id");

                // Grava que o produto foi para avaliação externa antes de mudar de página
                await updateOrderStatus(trackingCode, "REVIEWED");
              }}
              className="w-full py-3.5 bg-electric-blue hover:bg-electric-vivid text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            >
              <StarHalf size={14} />
              <span>Avaliar na Página do Produto</span>
            </Link>
          )}
          <Link
            href="/"
            className="w-full py-3.5 bg-electric-blue hover:bg-electric-vivid text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
          >
            <ShoppingCart size={13} />
            <span>Continuar Comprando</span>
          </Link>

          <button
            onClick={() => {
              router.refresh(); // Destrói o Router Cache do Next.js imediatamente
              router.push("/profile"); // Navega de forma limpa puxando o dado fresco do Supabase
            }}
            className="w-full py-2 flex items-center justify-center gap-1 text-xs font-bold text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Ver Meus Pedidos</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
