"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchCatalogProducts } from "@/modules/checkout/infra/services/fetch-catalog";
import { CatalogHeader } from "@/modules/checkout/presentation/components/catalog-header";
import { SearchFilters } from "@/modules/checkout/presentation/components/search-filters";
import { ProductCard } from "@/modules/checkout/presentation/components/product-card";
import { ProductSkeleton } from "@/modules/checkout/presentation/components/product-skeleton";
import { CartDrawer } from "@/modules/checkout/presentation/components/cart-drawer";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";

export default function CatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados locais dos filtros de busca e ordenação
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState("relevancia");

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

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Aplica a ordenação sobre o resultado filtrado
    if (sortBy === "preco-crescente") {
      return [...filtered].sort((a, b) => a.price - b.price); // Menor para Maior
    }

    if (sortBy === "preco-decrescente") {
      return [...filtered].sort((a, b) => b.price - a.price); // Maior para Menor
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy]);

  if (error) {
    throw new Error(`Não foi possível carregar o catálogo: ${error}`);
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 gap-8 font-sans">
      {/* Barra de Topo do Cliente */}
      <CatalogHeader />

      {/* Painel Controlado de Busca, Categorias e Preço */}
      {!loading && (
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
      )}

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
