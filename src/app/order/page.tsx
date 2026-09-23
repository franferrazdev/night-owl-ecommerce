"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Key,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";
import { useAuthStore } from "@/modules/checkout/presentation/store/auth-store";
import { toast } from "react-hot-toast";
import { createOrder } from "@/modules/checkout/infra/services/create-order";
export default function CheckoutPage() {
  const { items, getTotalAmount } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados dos Métodos de Pagamento e Copie e Cola
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [copiedPix, setCopiedPix] = useState(false);

  // Estados dos Dados de Entrega
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  //  Estados dos Dados do Cartão de Entrega
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  useEffect(() => {
    const hasNoAccess = items.length === 0 || !isAuthenticated;

    if (hasNoAccess) {
      toast.error(
        "Acesso restrito! Faça o login e adicione itens ao carrinho.",
      );
      router.push("/");
    }
  }, [items.length, isAuthenticated, router]);

  if (items.length === 0 || !isAuthenticated) {
    return null;
  }

  // Dados fictícios
  const handleApplyMockData = () => {
    setAddress("Av. Paulista, 1000 - Bloco B, Apto 42");
    setCity("São Paulo");
    setZipCode("01310-100");
    setCardNumber("4242 4242 4242 4242"); // Cartão de testes universal da Stripe
    setCardName("DEV FRONTEND");
    setCardExpiry("12/31"); // Qualquer validade futura passa no Stripe Sandbox
    setCardCVV("123"); // !ualquer CVV de 3 dígitos é aceito no ambiente dev
    toast.success(
      "Dados de homologação oficiais do Stripe injetados com sucesso!",
    );
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(
      "00020126420014br.gov.bcb.pix0120nightowl@example.com5204000053039865802BR5901N6001C62120508NIGHTOWL63046297",
    );
    setCopiedPix(true);
    toast.success("Código Pix Copie e Cola copiado!");
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleFinishOrder = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!address.trim() || !city.trim() || !zipCode.trim()) {
      toast.error("Por favor, preencha todos os campos de entrega.");
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "card") {
        const payloadItems = items.map((item) => ({
          id: String(item.id),
          title: String(item.title),
          price: Number(item.price),
          thumbnail: item.thumbnail ? String(item.thumbnail) : undefined,
          quantity: Number(item.quantity),
        }));

        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: payloadItems,
            email: user?.email || "dev@nightowl.com",
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Erro de rede: status ${res.status}`,
          );
        }

        const session = await res.json();

        if (session.url) {
          if (session.trackingCode) {
            sessionStorage.setItem(
              "active_tracking_code",
              session.trackingCode,
            );
          }

          toast.success("Redirecionando para o ambiente seguro do Stripe...");
          // Guarda o ID temporário do checkout no SessionStorage para controle local
          sessionStorage.setItem(
            "last_order_id",
            session.id || `owl-${Date.now()}`,
          );
          window.location.href = session.url;
          return;
        } else {
          throw new Error(
            "Sessão de pagamento retornou sem URL de redirecionamento.",
          );
        }
      }

      // Fluxo de pagamento via PIX
      if (paymentMethod === "pix") {
        const trackingCode =
          sessionStorage.getItem("active_tracking_code") ||
          `BR-${Math.floor(100000 + Math.random() * 900000)}`;

        const payloadItems = items.map((item) => ({
          id: String(item.id),
          title: String(item.title),
          thumbnail: item.thumbnail ? String(item.thumbnail) : "",
          price: Number(item.price),
          quantity: Number(item.quantity),
        }));

        const result = await createOrder({
          userId: "user-sandbox-01",
          trackingCode,
          totalAmount: getTotalAmount(),
          items: payloadItems,
        });

        if (!result.success) {
          throw new Error(result.error || "Não foi possível criar o pedido.");
        }

        sessionStorage.setItem("active_tracking_code", trackingCode);
        sessionStorage.setItem(
          "last_order_id",
          result.orderId || `owl-pix-${Date.now()}`,
        );

        toast.success("Pedido criado com sucesso!");

        router.push(
          `/order/success?productId=${encodeURIComponent(
            items[0].id,
          )}&trackingCode=${encodeURIComponent(trackingCode)}`,
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro inesperado no faturamento.";
      toast.error(message);
      console.error("Erro capturado no fluxo do checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#060B18] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <nav className="w-full bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-900 px-6 py-4 flex items-center justify-center shadow-xs">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            Abandonar Compra
          </Link>
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Checkout Seguro
          </span>
        </div>
      </nav>

      <main className="w-full max-w-5xl mx-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Formulários Combinados */}
        <section className="md:col-span-3 flex flex-col gap-6">
          {/* Painel Informativo Sandbox */}
          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3 transition-colors">
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                <Key size={12} />
                Ambiente de Homologação Sandbox (Stripe API Dev)
              </div>
              <button
                type="button"
                onClick={handleApplyMockData}
                className="px-3 py-1.5 bg-electric-blue hover:bg-electric-vivid text-white text-[10px] font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Preenchimento Rápido
              </button>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-400">
                  Endereço:
                </span>
                Av. Paulista, 1000 | SP | 01310-100
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-400">
                  Cartão Stripe:
                </span>
                4242 4242 4242 4242
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-400">
                  Titular:
                </span>
                DEV FRONTEND
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-400">
                  Validade / CVV:
                </span>
                12/31 | 123
              </div>
            </div>
          </div>

          {/* Estado de Controle da Aba de Pagamento Ativa */}

          <form
            onSubmit={handleFinishOrder}
            className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
          >
            {/* Bloco de Logística (Envio) */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-0.5 border-b border-slate-100 dark:border-slate-900 pb-2">
                <h2 className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Truck
                    size={14}
                    className="text-electric-blue dark:text-electric-cyan"
                  />
                  Dados de Envio
                </h2>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                  Endereço Residencial
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av.Paulista, 1000 - Apto 42"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                  Cidade
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                  CEP
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="01310-100"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Escolha de Forma de Pagamento */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-0.5 border-b border-slate-100 dark:border-slate-900 pb-2">
                <h2 className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <CreditCard
                    size={14}
                    className="text-electric-blue dark:text-electric-cyan"
                  />
                  Forma de Pagamento
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-1.5 border border-slate-200 dark:border-slate-900 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-white dark:bg-slate-900 text-electric-blue dark:text-electric-cyan shadow-sm border border-slate-200/60 dark:border-slate-800"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  Cartão de Crédito
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    paymentMethod === "pix"
                      ? "bg-white dark:bg-slate-900 text-electric-blue dark:text-electric-cyan shadow-sm border border-slate-200/60 dark:border-slate-800"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  PIX Transacional
                </button>
              </div>

              {/* Condicional da Aba de Cartão */}
              {paymentMethod === "card" ? (
                <div className="flex flex-col gap-4 pt-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/40 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200 font-mono tracking-wider"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                      Nome do Titular (Impressa no Cartão)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="EX.: DEV FRONTEND"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/40 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200 uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                        Validade
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/40 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200 uppercase"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        placeholder="123"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/40 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200 uppercase"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Condicional da Aba de PIX
                <div className="flex flex-col items-center justify-center text-center gap-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/60 rounded-xl p-6">
                  <div
                    className="w-36 h-36 bg-white border-2
border-slate-200 dark:border-slate-800 rounded-lg p-2 flex items-center justify-center shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/qrcode-pix.png"
                      alt="QR Code Pix Simulado Night Owl"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      Escaneie o QR Code acima
                    </span>
                    <p className="text-[10px] text-slate-400 max-w-70">
                      O QR Code acima simula um pagamento real. O sistema dará a
                      baixa e aprovação automática ao confirmar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="text-[10px] font-black tracking-wider uppercase border border-slate-200 dark:border-slate-800 hover:border-electric-blue dark:hover:border-electric-cyan px-4 py-2 rounded-lg bg-white dark:bg-slate-900 transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
                  >
                    {copiedPix ? "Copiado!" : "Copiar Código Pix Copie e Cola"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl mt2">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Gateway homologado sob conexão criptografada SSL
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-electric-blue hover:bg-electric-vivid dark:bg-slate-900 dark:hover:bg-slate-800 border border-electric-blue dark:border-slate-800 text-white dark:text-slate-200 dark:hover:text-electric-cyan text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <CreditCard size={14} />
              <span>
                {loading
                  ? "Processando pagamento..."
                  : paymentMethod === "card"
                    ? "Concluir Pagamento com Cartão"
                    : "Confirmar Pagamento via PIX"}
              </span>
            </button>
          </form>
        </section>

        {/* Resumo da Compra */}
        <section className="md:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-900">
            <ShoppingCart
              size={14}
              className="text-electric-blue dark:text-electric-cyan"
            />
            Resumo do Pedido
          </h3>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-4 text-xs"
              >
                <span className="text-slate-600 dark:text-slate-400 truncate flex-1">
                  {item.quantity}x {item.title}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Frete Fixo:</span>
              <span className="font-bold text-emerald-500 uppercase tracking-wider">
                Grátis
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-800 dark:text-slate-100 font-bold mt-1 text-base">
              <span>Valor Total:</span>
              <span className="text-electric-blue dark:text-electric-cyan font-black">
                R$ {getTotalAmount().toFixed(2)}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
