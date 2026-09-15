import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart, ShieldCheck, Divide } from "lucide-react";
import { fetchProductDetail } from "@/modules/checkout/infra/services/fetch-product-detail";
import { ProductReviews } from "@/modules/checkout/presentation/components/product-reviews";
import { ProductBuyBar } from "@/modules/checkout/presentation/components/product-buy-bar";
import { CartDrawer } from "@/modules/checkout/presentation/components/cart-drawer";

interface ProductPageProps {
  params: Promise<{ id: string }>; // Suporta as diretivas assíncronas do Next.js 16/React 19
}

export default async function ProductPage({ params }: ProductPageProps) {
  const revolvedParams = await params;
  const product = await fetchProductDetail(revolvedParams.id);

  if (!product) {
    notFound(); // Redireciona de forma automática para a 404 customizada do Next se o ID não existir
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#060B18] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Menu Superior Reduzido de Navegabilidade */}
      <nav className="w-full bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-900 px-6 py-4 flex items-center justify-center shadow-xs">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao Catálogo
          </Link>
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Night Owl Safe Purchase
          </span>
        </div>
      </nav>

      {/* Bloco Central de Detalhes */}
      <main className="w-full flex flex-col items-center justify-start p-6 md:p-12 gap-4">
        <div className="w-full max-w-5xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-950 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative transition-all">
          {/* Container de Visualização da Imagem da API */}
          <div className="w-full md:w-1/2 aspect-square flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-xl p-8 border border-slate-200 dark:border-slate-900/60 shrink-0 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail}
              alt={product.title}
              className="object-contain max-h-full max-w-full transition-transform duration-300 hover:scale-105"
            />
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                <span className="text-xs font-bold text-rose-400 tracking-widest uppercase">
                  Esgotado
                </span>
              </div>
            )}
          </div>

          {/* Especificações e Transações */}
          <div className="flex flex-col flex-1 w-full gap-5 min-w-0">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                Categoria: {product.category.replace("-", " ")}
              </span>
              <h2 className="text-xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                {product.title}
              </h2>
            </div>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Caixa de Selo de Garantia Transacional */}
            <div className="flex items-center gap-2 border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
              <ShieldCheck
                size={16}
                className="text-electric-blue dark:text-electric-cyan shrink-0"
              />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Garantia de Entrega Integral Night Owl com Estoque Controlado
              </span>
            </div>

            {/* Barra Transacional Homologada de Cliente */}
            <ProductBuyBar product={product} />
          </div>
        </div>

        {/* Sessão de Comentários */}
        <ProductReviews
          reviews={product.reviews || []}
          rating={product.rating}
        />
      </main>

      {/* Painel do Carrinho Zustand */}
      <CartDrawer />
    </div>
  );
}
