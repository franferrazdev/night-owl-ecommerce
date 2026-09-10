import { ProductSkeleton } from "@/modules/checkout/presentation/components/product-skeleton";

export default function CatalogLoading() {
  // Cria um array fictício de 12 posições apenas para renderizar os blocos pulsantes no grid
  const skeletonItems = Array.from({ length: 12 }, (_, index) => index);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 gap-8 font-sans">
      {/* Esqueleto Estrutural do Cabeçalho para evitar saltos de layout */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-bs-slate-900 animate-pulse">
        <div className="h-6 bg-slate-800 rounded-md w-40" />
        <div className="h-10 bg-slate-800 rounded-lg w-28" />
      </header>

      {/* Grid de Skeletons idêntico ao grid de produtos real */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {skeletonItems.map((id) => (
          <ProductSkeleton key={id} />
        ))}
      </div>
    </main>
  );
}
