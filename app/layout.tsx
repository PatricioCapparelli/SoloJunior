import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoloJunior | Empleos IT para principiantes",
  description: "La bolsa de trabajo exclusiva para Trainees y Juniors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
      <body className={inter.className}>
        <Navbar/>
        {children} 
      </body>
    </html>
    </ClerkProvider>
  );
}