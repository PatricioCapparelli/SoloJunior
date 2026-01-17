import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoloJunior | Empleos IT para principiantes",
  description: "La bolsa de trabajo exclusiva para Trainees y Juniors.",
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
            <Toaster />
          </ThemeProvider>
          
        </body>
      </html>
    </ClerkProvider>
  );
}