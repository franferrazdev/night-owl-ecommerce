import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";

// Criação do pool nativo do PostgreSQL conectando vai variáveis de ambiente da Vercel
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Inicialização do Singleton com o driver injetado de forma estrita
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

// Tipagem global do escopo NodeJS para evitar vazamento de conexões em ambiente dev
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prismaGlobal: PrismaClientSingleton | undefined;
};

// Exportação unificada da instância transacional
export const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = prisma;
}
