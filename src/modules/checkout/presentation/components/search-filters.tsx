"use client";

import {
  Search,
  Tag,
  DollarSign,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  maxPrice: number;
  onPriceChange: (value: number) => void;
  sortBy: string;
  onSortByChance: (value: string) => void;
  categories: string[];
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortByChance,
  categories,
}: SearchFiltersProps) {
  return (
    <div className="w-full max-w-5xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-900 rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-xl transition-colors">
      {/* Input de Busca por Texto */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-bold text-electric-blue dark:text-electric-cyan tracking-widest uppercase flex items-center gap-1.5">
          <Search size={11} />
          Pesquisar Produto
        </label>
        <div className="relative w-full flex items-center">
          <Search
            size={14}
            className="absolute left-3.5 text-slate-400 dark:text-slate-600 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Digite o nome do produto..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Filtro de Categorias Dinâmicas */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-bold text-blue-600 dark:text-cyan-500 tracking-widest uppercase flex items-center gap-1/5">
          <Tag size={11} />
          Filtra por Categoria
        </label>
        <div className="relative w-full flex items-center">
          <Tag
            size={14}
            className="absolute left-3.5 text-slate-400 dark:text-slate-600 pointer-events-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 outline-hidden transition-all cursor-pointer capitalize appearance-none"
          >
            <option value="todos">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("-", " ")}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3.5 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Seletor de Ordenação por Preço (Menor/Maior) */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-bold text-blue-600 dark:text-cyan-500 tracking-widest uppercase flex items-center gap-1.5">
          <ArrowUpDown size={11} />
          Ordenar por
        </label>
        <div className="relative w-full flex items-center">
          <ArrowUpDown
            size={14}
            className="absolute left-3.5 text-slate-400 dark:text-slate-600 pointer-events-none"
          />
          <select
            value={sortBy}
            onChange={(e) => onSortByChance(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs text-slate-800 dark:text-slate-200 outline-hidden transition-all cursor-pointer appearance-none"
          >
            <option value="relevancia">Relevância</option>
            <option value="preco-crescente">Menor Preço</option>
            <option value="preco-decrescente">Maior Preço</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3.5 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Slider Controlado de Preço Máximo */}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center justify-between w-full">
          <label className="text-[10px] font-bold text-blue-600 dark:text-cyan-500 tracking-widest uppercase flex items-center gap-1.5">
            <DollarSign size={11} />
            Preço Máximo
          </label>
          <span className="text-xs font-black text-blue-600 dark:text-cyan-400">
            R$ {maxPrice.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          step="10"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-electric-blue dark:accent-electric-cyan outline-hidden border border-slate-300 dark:border-slate-800/60"
        />
        <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider">
          <span>Min: R$ 0</span>
          <span>Min: R$ 2000</span>
        </div>
      </div>
    </div>
  );
}
