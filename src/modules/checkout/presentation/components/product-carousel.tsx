"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

interface ProductCarouselProps {
  featuredProducts: CatalogProduct[];
}

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
    <div
      className="w-full max-w-5xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row otems-c
     gap-8 shadow-xl relative min-h-85 transition-all overflow-hidden group"
    >
      {/* Container da Imagem em Destaque */}
      <div className="w-full md:1/2 aspect-video md:h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-xl p-6 border border-slate-100 dark:border-slate-900/60 shrink-0 relative overflow-hidden">
        {/* eslit-disable-next-line @next/next/no-img-element */}
        <img
          src={currentProduct.thumbnail}
          alt={currentProduct.title}
          className="object-contain max-w-full max-h-full animate-fade-in transition-all duration-500 scale-100 group-hover:scale-102"
          loading="eager"
        />
        <div className="absolute top-3 left-3 bg-electric-blue dark:bg-electric-cyan text-white dark:text-slate-950 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md shadow-xs">
          Destaque da Semana
        </div>
      </div>

      {/* Textos Informativos e Ações */}
      <div className="flex flex-col flex-1 justify-center w-full gap-4 min-w-0">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
            Categoria {currentProduct.category.replace("-", " ")}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            {currentProduct.title}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
          {currentProduct.description}
        </p>

        <div className="flex items-center gap-6 mt-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Preço Exclusivo
            </span>
            <span className="text-2xl font-black text-electric-blue dark:text-electric-cyan tracking-tight">
              R$ {currentProduct.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={currentProduct.stock <= 0}
            className="flex items-center gap-2 py-2 px-2 bg-electric-blue hover:bg-electric-vivid dark:bg-slate-900 dark:hover:bg-slate-800 border border-electric-blue dark:border-slate-800 text-white dark:text-slate-200 dark:hover:text-electric-cyan text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.98]"
          >
            <ShoppingCart size={13} />
            <span>Comprar Agora</span>
          </button>
        </div>
      </div>

      {/* Controles Laterais de Navegação */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer hidden md:flex"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer hidden md:flex"
        aria-label="Próximo slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Bullets de Paginação */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
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
