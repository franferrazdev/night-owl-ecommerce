"use client";

import { useEffect, useState, useMemo } from "react";
import { Heart, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { fetchCatalogProducts } from "@/modules/checkout/infra/services/fetch-catalog";
import { SearchFilters } from "@/modules/checkout/presentation/components/search-filters";
import { ProductCard } from "@/modules/checkout/presentation/components/product-card";
import { ProductSkeleton } from "@/modules/checkout/presentation/components/product-skeleton";
import { CartDrawer } from "@/modules/checkout/presentation/components/cart-drawer";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";
import { useWishlistStore } from "@/modules/checkout/presentation/store/wishlist-store";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

export default function CatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();

  // Estados locais dos filtros de busca e ordenação
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState("relevancia");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { toggleCart, getTotalItemsCount } = useCartStore();
  const { favoriteIds } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 gap-8 font-sans transition-colors duration-200">
      {/* Cabeçalho de Navegação */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-900 transition-colors">
        <h1 className="text-xl font-black tracking-wider bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          NIGHT OWL CATALOG
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-electric-cyan rounded-lg transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Alternar tema de cores"
          >
            {mounted && theme === "dark" ? (
              <Sun size={15} />
            ) : (
              <Moon size={15} />
            )}
          </button>

          <button
            onClick={toggleCart}
            className="relative p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-7 dark:text-slate-300 hover:text-blue-500 dark:hover:text-electric-cyan rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200"
          >
            <span>Meu Carrinho</span>

            {mounted && getTotalItemsCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-electric-blue dark:bg-electric-cyan text-white dark:text-shadow-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {getTotalItemsCount()}
              </span>
            )}
          </button>
        </div>
      </header>
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {!loading && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  showOnlyFavorites
                    ? "bg-electric-blue/10 dark:bg-electric-cyan/10 border-electric-blue/30 dark:border-electric-cyan/50 text-electric-blue dark:text-electric-cyan"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
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
