"use client";

import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = () => {
    // Adapta o contrato do catálogo para a entidade estrita do carrinho
    addItem({
      id: product.id,
      externalId: product.externalId,
      title: product.title,
      price: product.price,
      stock: product.stock,
    });
    // Abre o painel lateral automaticamente para feedback imediato do usuário
    toggleCart();
  };

  return (
    <div className="flex flex-col bg-[#0F1626] border border-bs-slate-900 rounded-xl overflow-hidden shadow-lg hover:border-bs-slate-800/80 transition-all group">
      {/* Container de Imagem Otimizado contra Fadiga Visual */}
      <div className="relative w-full aspect-square bg-slate-950 flex items-center justify-center p-4 border-b border-bs-slate-900 overflow-hidden">
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
        <h3 className="text-sm font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-bs-slate-900">
          <span className="text-base font-black text-cyan-400">
            R$ {product.price.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            Estoque: {product.stock}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 border border-bs-slate-800 hover:border-cyan-500/30 text-slate-200 hover:text-cyan-400 text-xs font-bold tracking-wider uppercase rounded-lg transition-all disabled:opacity-20 disabled:hover:bg-slate-900 disabled:hover:text-slate-200 disabled:hover:border-bs-slate-800"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
