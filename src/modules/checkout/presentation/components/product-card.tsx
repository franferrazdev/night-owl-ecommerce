"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";
import { useWishlistStore } from "@/modules/checkout/presentation/store/wishlist-store";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleCart } = useCartStore();
  const { toggleFavorite, favoriteIds } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  // Evita divergência de hidratação ao ler o estado persistido do Zustand
  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorited = mounted ? favoriteIds.includes(product.id) : false;

  const handleAddToCart = () => {
    // Adapta o contrato do catálogo para a entidade estrita do carrinho
    addItem({
      id: product.id,
      externalId: product.externalId,
      title: product.title,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
    });
    // Abre o painel lateral automaticamente para feedback imediato do usuário
    toggleCart();
  };

  return (
    <div className="flex flex-col bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl dark:hover:border-slate-800/80 transition-all group relative">
      {/* Botão Flutuante de Favoritos */}
      <button
        onClick={() => toggleFavorite(product.id)}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-950/90 border border-slate-200 dark:border-slate-900 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-all cursor-pointer group/heart shadow-xs"
        aria-label={
          isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
      >
        <Heart
          size={15}
          className={`${
            isFavorited
              ? "fill-blue-600 text-blue-600 dark:fill-cyan-400 dark:text-cyan-400 scale-110"
              : "text-slate-400 dark:text-slate-500 group-hover/heart:scale-110"
          } transition-transform duration-200`}
        />
      </button>

      {/* Container de Imagem */}
      <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 border-b border-slate-100 dark:border-slate-900 overflow-hidden">
        {/* eslint-disabled-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs font-bold text-rose-400 tracking-widest uppercase">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo Textual com Informações Fluidas */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-electric-blue dark:group-hover:text-electric-cyan transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-900">
          <span className="text-base font-black text-electric-blue dark:text-electric-cyan">
            R$ {product.price.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
            Estoque: {product.stock}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full mt-2 py-2.5 bg-electric-blue hover:bg-electric-vivid dark:bg-slate-900 dark:hover:bg-slate-800 border border-electric-blue dark:border-slate-800 text-white dark:text-slate-200 dark:hover:border-electric-cyan text-xs font-bold tracking-wider uppercase rounded-lg transition-all disabled:opacity-20"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
