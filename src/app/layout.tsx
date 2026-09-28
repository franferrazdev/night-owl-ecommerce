import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Night Owl Ecommerce",
  description: "Plataforma de alta performance transacional",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-auto antialiased`}
    >
      <body className="h-auto min-h-screen antialiased m-0 p-0 bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 3000,
              className:
                "font-sans text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 shadow-md",
              success: {
                className:
                  "font-sans text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 shadow-md",
              },
              error: {
                className:
                  "font-sans text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 shadow-md",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
