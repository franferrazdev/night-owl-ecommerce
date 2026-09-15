"use client";

import { ShoppingCart } from "lucide-react";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

interface ProductBuyBarProps {
  product: CatalogProduct;
}

export function ProductBuyBar({ product }: ProductBuyBarProps) {
  const { addItem, toggleCart } = useCartStore();

  const handleAddCart = () => {
    addItem({
      id: product.id,
      externalId: product.externalId,
      title: product.title,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
    });
    toggleCart();
  };

  return (
    <div className="flex items-center justify-between mt-3 pt-4 border-t border-slate-100 dark:border-slate-900 gap-4 w-full">
      <div className="flex flex-col">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          Valor do Item
        </span>
        <span className="text-2xl md:text-3xl font-black text-electric-blue dark:text-electric-cyan tracking-tight">
          R$ {product.price.toFixed(2)}
        </span>
      </div>

      <button
        onClick={handleAddCart}
        disabled={product.stock <= 0}
        className="flex items-center gap-2 py-3.5 px-6 bg-electric-blue hover:bg-electric-vivid dark:bg-slate-900 dark:hover:bg-slate-800 border border-electric-blue dark:border-slate-800 text-white dark:text-slate-200 dark:hover:text-electric-cyan text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md text-center active:scale-[0.98] disabled:opacity-20"
      >
        <ShoppingCart size={13} />
      </button>
    </div>
  );
}
