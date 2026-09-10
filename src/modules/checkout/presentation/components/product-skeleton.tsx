export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-[#0F1626] border border-bs-slate-900 rounded-xl overflow-hidden shadow-lg p-5 gap-4 animate-pulse">
      {/* Bloco Pulsante da Imagem */}
      <div className="w-full aspect-square bg-slate-950 rounded-lg border border-bs-slate-900" />

      {/* Bloco Pulsante do Título */}
      <div className="h-4 bg-slate-800 rounded-md w-3/4 mt-1" />

      {/* Blocos Pulsantes da Descrição */}
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-slate-800 rounded-md w-full" />
        <div className="h-3 bg-slate-800 rounded-md w-1/4" />
      </div>

      {/* Bloco Pulsante do Rodapé Transacional */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-bs-neutral-900">
        <div className="h-5 bg-slate-800 rounded-md w-1/3" />
        <div className="h-5 bg-slate-800 rounded-md w-1/4" />
      </div>

      {/* Bloco Pulsante do Botão */}
      <div className="w-full h-10 bg-slate-950 rounded-lg border border-bs-slate-900 mt-2" />
    </div>
  );
}
