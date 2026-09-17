"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, Layers, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";
import { useWishlistStore } from "@/modules/checkout/presentation/store/wishlist-store";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";
import { ProductRating } from "@/modules/checkout/presentation/components/product-rating";
import { toast } from "react-hot-toast";

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

  const isFavorited = useMemo(() => {
    if (!mounted) return false;
    return favoriteIds.includes(product.id);
  }, [favoriteIds, product.id, mounted]);

  const isSoldOut = product.stock === 0;

  const handleAddToCart = () => {
    if (isSoldOut) return;

    // Adapta o contrato do catálogo para a entidade estrita do carrinho
    addItem({
      id: product.id,
      externalId: product.externalId,
      title: product.title,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
    });
    // Dispara o Alerta Flutuante de Sucesso na Tela
    toast.success(`${product.title} adicionado ao carrinho com sucesso!`, {
      style: { border: "1px solid var(--color-electric-blue)" },
    });
    // Abre o painel lateral automaticamente para feedback imediato do usuário
    toggleCart();
  };

  const handleFavoriteClick = () => {
    toggleFavorite(product.id);
    if (isFavorited) {
      toast.success(`${product.title} removido dos favoritos.`);
    } else {
      toast.success(`${product.title} salvo nos favoritos!`);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-900 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(34, 211, 238, 0.05)] hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300 group h-full relative">
      {/* Badge de Esgotado ou Desconto */}
      {isSoldOut ? (
        <span className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-wider bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 px-2.5 py-1 rounded-md shadow-md">
          Esgotado
        </span>
      ) : (
        product.discountPercentage &&
        product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-wider bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 px-2.5 py-1 rounded-md shadow-md">
            -{Math.round(product.discountPercentage)}% OFF
          </span>
        )
      )}

      {/* Botão Flutuante de Favoritos */}
      <button
        onClick={handleFavoriteClick}
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
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <Layers
            size={32}
            className="text-slate-300 dark:text-slate-700 stroke-[1.2]"
          />
        )}
      </div>

      {/* Corpo das Especificações */}
      <div className="flex flex-col flex-1 p-5 gap-2.5 min-w-0">
        <Link href={`/product/${product.id}`} className="group/title block">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover/title:text-electric-blue dark:group-hover/title:text-electric-cyan transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mt-1">
          <ProductRating rating={product.rating ?? 0} />
        </div>

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
          disabled={isSoldOut}
          className="w-full mt-2 py-2.5 bg-electric-blue hover:bg-electric-vivid dark:bg-slate-900 dark:hover:bg-slate-800 border border-electric-blue dark:border-slate-800 text-white dark:text-slate-200 dark:hover:border-electric-cyan text-xs font-bold tracking-wider uppercase rounded-lg transition-all disabled:opacity-20 cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingCart size={13} />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
