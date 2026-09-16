import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Filtro Edge Server-Side: Intercepta as requisições de rotas dinamicamente no servidor antes que o HTML ou o JavaScript cheguem ao navegador do cliente. */
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("night_owl_session");
  const isAuthenticated = !!sessionCookie?.value;

  // Se o usuário tentar acessar /profile sem estar logado, ele é ejetado de volta para o catálogo
  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

// Configura o Next.js para rodar esse middleware exclusivamente na rota  do perfil
export const config = {
  matcher: ["/profile/:path*"],
};
