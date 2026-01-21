import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/theme-provider';
import AdminButton from "@/components/AdminButton";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SoloJunior | Bolsa de trabajo para Trainees y Juniors",
    template: "%s | SoloJunior", 
  },
  description: "La plataforma donde la experiencia de 5 años NO es un requisito. Encontrá tu primer empleo IT en programación, diseño y datos.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={inter.className}>
          
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <AdminButton />
            <Toaster />
          </ThemeProvider>

          <Analytics />
          
        </body>
      </html>
    </ClerkProvider>
  );
}