import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserData {
  name: string;
  email: string;
  passwordHash: string;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  registerUser: (name: string, email: string, passwordHash: string) => void;
  loginWithHash: (nuser: UserData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      //   Salva o novo cadastro mascarando a senha fisicamente
      registerUser: (name, email, passwordHash) => {
        set({ user: { name, email, passwordHash }, isAuthenticated: false });
      },

      // Valida o login gerando o cookie de sessão seguro do servidor
      loginWithHash: (userData) => {
        document.cookie =
          "night_owl_session=true; path=/; max-age=86400; SameSite=Strict";
        set({ user: userData, isAuthenticated: true });
      },

      logout: () => {
        // Limpa o cookie de sessão removendo o tempo de expiração
        document.cookie =
          "night_owl_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "night-owl-auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
