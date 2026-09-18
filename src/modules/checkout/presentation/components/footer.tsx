"use client";

import { Shield, Globe, User, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-900 mt-16 px-6 py-12 flex flex-col items-center justify-center transition-colors duration-200">
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-slate-100 dark:border-slate-900/60">
        {/* Branding */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-black tracking-wider bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent uppercase">
            <Shield
              size={16}
              className="text-blue-500 dark:text-cyan-400 shrink-0"
            />
            Night Owl Store
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-60">
            Plataforma transacional homologada sob arquitetura limpa Next.js App
            Router e segurança criptográfica ponta a ponta.
          </p>
        </div>

        {/* Links Rápidos */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
            Navegabilidade
          </span>
          <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="hover:text-electric-blue dark:hover:text-electric-cyan transition-colors cursor-pointer">
              Política de Privacidade
            </span>
            <span className="hover:text-electric-blue dark:hover:text-electric-cyan transition-colors cursor-pointer">
              Termos de Serviço
            </span>
            <span className="hover:text-electric-blue dark:hover:text-electric-cyan transition-colors cursor-pointer">
              Ajuda & Suporte
            </span>
          </div>
        </div>

        {/* Conexões de Engenharia */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
            Engineers Connections
          </span>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 mt-1">
            <a
              href="https://github.com/franferrazdev"
              target="_blank"
              rel="noopener noreferrer"
              title="Acessar Portfólio Global no GitHub"
              className="hover:text-electric-blue dark:text-electric-cyan transition-colors cursor-pointer"
            >
              <Globe size={16} />
            </a>

            <a
              href="https://www.linkedin.com/in/francielle-ferraz-de-sousa-franferrazdev"
              target="_blank"
              rel="noopener noreferrer"
              title="Conectar Perfil Profissional no Linkedin"
              className="hover:text-electric-blue dark:text-electric-cyan transition-colors cursor-pointer"
            >
              <User size={16} />
            </a>

            <a
              href="mailto:franferraz.dev@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Disparar Contato Corporativo via E-mail"
              className="hover:text-electric-blue dark:text-electric-cyan transition-colors cursor-pointer"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Direitos Autorais */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between pt-6 text-[10px] text-slate-400 dark:text-slate-500 font-medium gap-2">
          <span>
            &copy; {currentYear} Francielle Ferraz &bull; Night Owl Store. Todos
            os direitos reservados.
          </span>
          <span className="flex items-center gap-1 uppercase tracking-wider text-[9px] font-bold text-slate-400 dark:text-slate-600">
            Sandbox Core Environment Active
          </span>
        </div>
      </div>
    </footer>
  );
}
