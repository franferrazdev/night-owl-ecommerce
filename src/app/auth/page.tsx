"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  LogIn,
  UserPlus,
  ArrowLeft,
  Key,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "@/modules/checkout/presentation/store/auth-store";
import { toast } from "react-hot-toast";

async function generateSHA256Hash(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);

  // Converte o buffer de bytes direto para uma string hexadecimal de forma atômica
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toLowerCase();
}

const PASSWORD_HASH =
  "550c0a314903d8b7331b23890575e6b76c1e6b2dac4a1f449d75ad448c447ed4";

export default function AuthPage() {
  const { registerUser, loginWithHash, isAuthenticated, user, logout } =
    useAuthStore();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "cadastro">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("dev@nightowl.com");
  const [password, setPassword] = useState("@NightOwl2026");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleClearCache = () => {
    logout();
    localStorage.removeItem("night-owl-auth-storage");
    toast.success("Cache resetado com sucesso!");
    window.location.reload();
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validação de caractere especial
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(cleanPassword)) {
      toast.error(
        "A senha digitada deve conter ao menos um caractere especial (Ex: @, #, $, %).",
      );
      return;
    }

    try {
      const computedHash = await generateSHA256Hash(cleanPassword);

      if (mode === "login") {
        if (
          cleanEmail === "dev@nightowl.com" &&
          computedHash === PASSWORD_HASH
        ) {
          loginWithHash({
            name: "Dev Front-End",
            email: cleanEmail,
            passwordHash: PASSWORD_HASH,
          });
          toast.success("Bem-vindo de volta!");
          router.push("/profile");
          return;
        } else if (
          user &&
          cleanEmail === user.email.toLowerCase() &&
          computedHash === user.passwordHash
        ) {
          loginWithHash(user);
          toast.success(`Bem-vindo de volta, ${user.name}!`);
          router.push("/profile");
          return;
        } else {
          toast.error(
            "Credenciais inválidas! A assinatura criptográfica não confere.",
          );
        }
      } else {
        if (!name.trim()) {
          toast.error("Por favor, informe seu nome completo.");
          return;
        }
        registerUser(name, cleanEmail, computedHash);
        toast.success("Conta criada com sucesso! Faça o login para acessar.");
        setMode("login");
        setPassword("");
      }
    } catch (err) {
      toast.error("Falha crítica no barramento de criptografia do navegador.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#06B18] text-slate-100 font-sans flex items-center justify-center p-6 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 transition-colors">
        <div className="flex flex-col gap-1 text-center">
          <div className="w-12 h-12 bg-electric-blue/10 dark:bg-electric-cyan/10 border border-electric-blue/20 dark:border-electric-cyan/30 rounded-xl flex items-center justify-center mx-auto text-electric-blue dark:text-electric-cyan">
            <Shield size={12} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 mt-2">
            {mode === "login" ? "Acessar Conta" : "Criar Nova Conta"}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {mode === "login"
              ? "Insira suas credenciais para gerenciar seus pedidos"
              : "Cadastre-se na plataforma transacional Night Owl"}
          </p>
        </div>

        {mode === "login" && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2 transition-colors relative">
            <button
              type="button"
              onClick={handleClearCache}
              title="Limpar conflitos de estado do LocalStorage"
              className="absolute top-3 right-3 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan hover:rotate-180 transition-all duration-300 cursor-pointer"
            >
              <RefreshCw size={11} />
            </button>

            <div className="flex items-center gap-2 text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
              <Key size={12} />
              Acesso Rápido para Recrutadores
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-1 leading-relaxed">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  E-mail:
                </span>{" "}
                dev@nightowl.com
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Senha:
                </span>{" "}
                @NightOwl2026
              </div>
            </div>
            <div className="mt-1 pt-2 border-t border-slate-200 dark:border-slate-900 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-medium">
              <Lock size={10} className="text-emerald-500" />
              <span>
                Segurança Homologada: Criptografia SHA-256 ativa Client-side
              </span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          {mode === "cadastro" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                placeholder="Ex.: Dev Fron-End"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="********"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg outline-hidden text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 my-3 bg-electric-blue hover:bg-electric-vivid dark:bg-slate-900 dark:hover:bg-slate-800 border
     border-electric-blue dark:border-slate-800 text-white dark:text-slate-200 dark:hover:text-electric-cyan text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <LogIn size={14} />
            <span>
              {mode === "login" ? "Entrar na Conta" : "Concluir Cadastro"}
            </span>
          </button>
        </form>

        <div className="text-center text-xs">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "cadastro" : "login")}
            className="text-slate-500 dark:text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan font-bold transition-colors cursor-pointer"
          >
            {mode === "login"
              ? "Não tem uma conta? Cadastre-se aqui"
              : "Já possui cadastro? Faça o login"}
          </button>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-slate-400 hover:text-slate-600 text-center uppercase tracking-wider transition-colors mt1 flex items-center justify-center gap-1"
        >
          <ArrowLeft size={12} />
          Voltar ao Catálogo
        </Link>
      </div>
    </div>
  );
}
