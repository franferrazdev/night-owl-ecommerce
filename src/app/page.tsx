"use client";

import { useEffect, useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { fetchCatalogProducts } from "@/modules/checkout/infra/services/fetch-catalog";
import { CatalogHeader } from "@/modules/checkout/presentation/components/catalog-header";
import { SearchFilters } from "@/modules/checkout/presentation/components/search-filters";
import { ProductCard } from "@/modules/checkout/presentation/components/product-card";
import { ProductSkeleton } from "@/modules/checkout/presentation/components/product-skeleton";
import { CartDrawer } from "@/modules/checkout/presentation/components/cart-drawer";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";
import { useWishlistStore } from "@/modules/checkout/presentation/store/wishlist-store";

export default function CatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados locais dos filtros de busca e ordenação
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState("relevancia");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { favoriteIds } = useWishlistStore();

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const data = await fetchCatalogProducts();
        setProducts(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Extrai a lista de categorias únicas disponíveis no payload real da API
  const dynamicCategories = useMemo(() => {
    const list = products.map((p) => p.category);
    return Array.from(new Set(list)).sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    // Primeiro filtra os itens com base nos critérios
    const filtered = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "todos" || product.category === selectedCategory;

      const matchesPrice = product.price <= maxPrice;

      const matchesFavorites =
        !showOnlyFavorites || favoriteIds.includes(product.id);

      return (
        matchesSearch && matchesCategory && matchesPrice && matchesFavorites
      );
    });

    // Aplica a ordenação sobre o resultado filtrado
    if (sortBy === "preco-crescente") {
      return [...filtered].sort((a, b) => a.price - b.price); // Menor para Maior
    }

    if (sortBy === "preco-decrescente") {
      return [...filtered].sort((a, b) => b.price - a.price); // Maior para Menor
    }

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategory,
    maxPrice,
    sortBy,
    showOnlyFavorites,
    favoriteIds,
  ]);

  if (error) {
    throw new Error(`Não foi possível carregar o catálogo: ${error}`);
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 gap-8 font-sans">
      {/* Barra de Topo do Cliente */}
      <CatalogHeader />

      <div className="w-full max-w-5xl flex flex-col gap-4">
        {!loading && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  showOnlyFavorites
                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Heart
                  size={14}
                  className={showOnlyFavorites ? "fill-cyan-400" : ""}
                />
                <span>
                  {showOnlyFavorites
                    ? "Ver Todos os Produtos"
                    : `Meus Favoritos (${favoriteIds.length})`}
                </span>
              </button>
            </div>

            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              maxPrice={maxPrice}
              onPriceChange={setMaxPrice}
              sortBy={sortBy}
              onSortByChance={setSortBy}
              categories={dynamicCategories}
            />
          </div>
        )}
      </div>

      {/* Grid Dinâmico de Produtos Filtrados */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
        {loading ? (
          Array.from({ length: 12 }, (_, i) => <ProductSkeleton key={i} />)
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-sm font-bold text-slate-400">
              Nenhum produto encontrado
            </span>
            <p className="text-xs text-slate-600">
              Tente ajustar os critérios de texto, categoria ou preço máximo.
            </p>
          </div>
        ) : (
          filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Drawer do Carrinho */}
      <CartDrawer />
    </main>
  );
}
