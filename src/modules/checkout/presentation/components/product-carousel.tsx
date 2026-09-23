"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

interface ProductCarouselProps {
  featuredProducts: CatalogProduct[];
}

// Dicionário: Associa o Id dos produtos em destaque a Banners de Marketing Sazonais
const CAMPAIGN_METADATA: Record<
  string,
  { tag: string; bannerTitle: string; bannerDesc: string }
> = {
  default: {
    tag: "Oferta Especial",
    bannerTitle: "Campanha Promocional Sazonal Night Owl",
    bannerDesc:
      "Aproveite condicoes exclusivas de frete e faturamento sandbox direto da nossa esteira transacional.",
  },
  // Mapeamento dinâmico para os primeiros IDs de produtos injetados pela API
  "1": {
    tag: "Tecnologia Noir",
    bannerTitle: "Semana Cyber Tech de Alta Performance",
    bannerDesc:
      "Eleve o nivel do seu setup mobile com o processamento inteligente e telas de ultima geracao.",
  },
  "2": {
    tag: "Estilo Midnight",
    bannerTitle: "Fragrâncias & Essencias Premium em Destaque",
    bannerDesc:
      "Sinta a elegancia das notas importadas com descontos de faturamento progressivo de ate 30% OFF.",
  },
  "3": {
    tag: "Design Coruja",
    bannerTitle: "Arquitetura e Decoracao Minimalista Atômica",
    bannerDesc:
      "Renove o seu espaco de desenvolvimento com moveis e acessorios moldados para alta produtividade.",
  },
};

export function ProductCarousel({ featuredProducts }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem, toggleCart } = useCartStore();

  // Efeito de Automação: Pass o slide sozinho a cada 5 segundos
  useEffect(() => {
    if (featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts]);

  if (featuredProducts.length === 0) return null;

  const currentProduct = featuredProducts[currentIndex];

  // Captura os dados do banner correspondente ao ID do produto ou assume o modelo de fábrica padrão
  const capaign =
    CAMPAIGN_METADATA[currentProduct.id] || CAMPAIGN_METADATA["default"];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredProducts.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const handleAddToCart = () => {
    addItem({
      id: currentProduct.id,
      externalId: currentProduct.externalId,
      title: currentProduct.title,
      price: currentProduct.price,
      stock: currentProduct.stock,
      thumbnail: currentProduct.thumbnail,
    });
    toggleCart();
  };

  return (
    <div className="w-full max-w-5xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative min-h-85 transition-all duration-500 overflow-hidden group text-slate-900 dark:text-slate-100">
      {/* Container da Imagem em Destaque */}
      <Link
        href={`/product/${currentProduct.id}`}
        className="w-full md:1/2 aspect-video md:h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/60 rouded-xl p-6 shrink-0 relative overflow-hidden cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentProduct.thumbnail}
          alt={currentProduct.title}
          className="object-contain max-w-full max-h-full animate-fade-in transition-all duration-500 scale-100 group-hover:scale-102"
          loading="eager"
        />
        <div
          title="Campanha sazonal ativa no ambiente sandbox Night Owl"
          className="absolute top-3 left-3 bg-electric-blue dark:bg-electric-cyan text-slate-100 dark:text-slate-950 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5 select-none"
        >
          <Sparkles size={10} className="fill-current" />
          {capaign.tag}
        </div>

        {/* Interactive Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 dark:bg-slate-950/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-center p-4 transition-opacity duration-300 gap-1.5 z-20">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
            Ver Detalhes do Item
          </span>
          <h3 className="text-sm font-bold text-white line-clamp-2 px-4 max-w-70">
            {currentProduct.title}
          </h3>
          <span className="text-base font-black text-emerald-400">
            R$ {currentProduct.price.toFixed(2)}
          </span>
        </div>
      </Link>

      {/* Textos Informativos e Ações */}
      <div className="flex flex-col flex-1 justify-center w-full gap-4 min-w-0">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
            Vitrine Exclusiva &bull; {currentProduct.category.replace("-", " ")}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            {capaign.bannerTitle}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
          {capaign.bannerDesc}
        </p>

        <div className="flex items-center gap-6 mt-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              A partir de
            </span>
            <span className="text-2xl font-black text-electric-blue dark:text-electric-cyan tracking-tight">
              R$ {currentProduct.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={currentProduct.stock <= 0}
            className="flex items-center gap-2 py-3 px-5 bg-electric-blue hover:bg-electric-vivid dark:bg-slate-900 dark:hover:bg-slate-800 border border-electric-blue dark:border-slate-800 text-white dark:text-slate-200 dark:hover:text-electric-cyan text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.98]"
          >
            <ShoppingCart size={13} />
            <span>Comprar Agora</span>
          </button>
        </div>
      </div>

      {/* Controles Laterais de Navegação */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Trava a propagação do clique para o Link de fundo
          handlePrev();
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer hidden md:flex z-50"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Trava a propagação do clique para o Link de fundo
          handleNext();
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer hidden md:flex z-50"
        aria-label="Próximo slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Bullets de Paginação */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              index === currentIndex
                ? "w-4 bg-electric-blue dark:bg-electric-cyan"
                : "w-1.5 bg-slate-200 dark:bg-slate-800"
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
