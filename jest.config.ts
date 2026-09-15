import type { Config } from "jest";
import nextJest from "next/jest.js";

// Vincula o Jest ao compilador nativo do Next.js para ler o TypeScript
const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Ensina o Jest a descriptografar o atalho de pastas @/
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
