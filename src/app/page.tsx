import { fetchCatalogProducts } from "@/modules/checkout/infra/services/fetch-catalog";
import { CatalogHeader } from "@/modules/checkout/presentation/components/catalog-header";
import { ProductCard } from "@/modules/checkout/presentation/components/product-card";
import { CartDrawer } from "@/modules/checkout/presentation/components/cart-drawer";

export default async function CatalogPage() {
  const products = await fetchCatalogProducts();

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 gap-8 font-sans">
      {/* Barra de Topo do Cliente */}
      <CatalogHeader />

      {/* Grid Dinâmico de Produtos - Arquitetura de Interface de Alta Conversão */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Painel do Carrinho (Injetado de forma global para escutar os cliques dos cards) */}
      <CartDrawer />
    </main>
  );
}
