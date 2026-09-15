"use client";

import { ComponentType } from "react";
import {
  Smartphone,
  Sparkles,
  Laptop,
  Watch,
  Shirt,
  ShoppingBag,
  Layers,
  Grid,
} from "lucide-react";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const iconMap: Record<
  string,
  ComponentType<{ size?: number; className?: string }>
> = {
  smartphones: Smartphone,
  fragrances: Sparkles,
  beauty: Sparkles,
  laptops: Laptop,
  watches: Watch,
  "mens-shirt": Shirt,
  "womens-dress": Shirt,
  "womens-bag": ShoppingBag,
};

export function CategoryBar({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryBarProps) {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-2">
      <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase pl-1">
        Navegação Rápida
      </label>

      {/* Container Horizontal com Scroll Invisível */}
      <div className="w-full flex items-center gap-3.5 overflow-x-auto bg-3 pt-1 scrollbar-none snap-x snap-mandatory">
        {/* Botão: Todas as Categorias */}
        <button
          onClick={() => onCategoryChange("todos")}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer snap-start shrink-0 shadow-xs ${
            selectedCategory === "todos"
              ? "bg-electric-blue border-electric-blue text-white shadow-[0_0_15px_rgba(37, 99, 235, 0.25)]"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-electric-blue dark:hover:border-electric-cyan"
          }`}
        >
          <Grid size={14} />
          <span>Todos</span>
        </button>

        {/* Mapeamento das Categorias Dinâmicas */}
        {categories.map((cat) => {
          // Busca o ícone correspondente ou usa o Layers caso não encontre correspondência direita
          const IconComponent = iconMap[cat] || Layers;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer snap-start shrink-0 shadow-xs ${
                isSelected
                  ? "bg-electric-blue dark:bg-electric-cyan border-electric-blue dark:border-electric-cyan text-white dark:text-slate-950 shadow-[0_0_15px_rgba(34, 211, 238, 0.25)]"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-electric-blue dark:hover:border-electric-cyan"
              }`}
            >
              <IconComponent size={14} />
              <span>{cat.replace("-", " ")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
