"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
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
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

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
    // Gera o código localizador aleatório único no client-side
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setTrackingCode(`BR-${randomDigits}`);

    // Avança os estágios de forma autônoma apenas até DELIVERED
    const timer1 = setTimeout(() => {
      setCurrentStatus((prev) => (prev === "PREPARING" ? "SHIPPED" : prev));
      toast.success("Logística: O seu pedido foi despachado e está a caminho!");
    }, 4000);

    const timer2 = setTimeout(() => {
      setCurrentStatus((prev) => (prev === "SHIPPED" ? "DELIVERED" : prev));
      toast.success(
        "Logística: Pacote entregue! Por favor, confirme o recebimento para liberar as avaliações.",
      );
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      sessionStorage.removeItem("last_order_id");
    };
  }, [orderId]);

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
  const handleConfirmDelivery = () => {
    if (currentStatus === "DELIVERED") {
      setCurrentStatus("CONFIRMED");
      toast.success(
        "Sucesso: Recebimento confirmado! Clique em Avaliar para prosseguir.",
      );
    }
  };

  // Usuário clica em Avaliar Pedido -> Avança para a etapa de preenchimento (REVIEWING)
  const handleGoToReviewStage = () => {
    if (currentStatus === "CONFIRMED") {
      setCurrentStatus("REVIEWING" as OrderStatus);
    }
  };

  // Usuário vota localmente pelas estrelas -> Completa a etapa REVIEWED
  const handleLocalRating = (selectedStars: number) => {
    setRating(selectedStars);
    setCurrentStatus("REVIEWED"); // Avança para a última etapa automaticamente
    toast.success(`Obrigado pela nota de ${selectedStars} estrelas!`);
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
              onClick={() => {
                setCurrentStatus("REVIEWED");
                sessionStorage.removeItem("last_purchased_product_id");
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
