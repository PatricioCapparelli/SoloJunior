"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="border-b bg-white dark:bg-slate-950 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* --- LOGO (Visible SIEMPRE) --- */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <Image
              src="/logo.png"
              alt="SoloJunior Logo"
              width={80}  // Medida real aproximada
              height={80} // Medida real aproximada
              priority    // ESTO ES CLAVE: Le dice que cargue primero que todo
            />
          </div>
        </Link>

        {/* =======================================================
            SECCIÓN DESKTOP (PC)
            hidden md:flex -> Se oculta en móvil, se ve en PC
           ======================================================= */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#5AB1C3] transition-colors">
            Buscar
          </Link>

          <ModeToggle />

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" aria-label="boton ingresar">Ingresar</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>

            <Link
              href="/saved-jobs"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#5AB1C3] mr-4 transition-colors flex items-center gap-1"
            >
              Guardados
            </Link>

            <Link
              href="/my-jobs"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#5AB1C3] mr-2 transition-colors"
            >
              Mis Publicaciones
            </Link>

            <Button asChild variant="default" size="sm" className="bg-[#5AB1C3] text-white hover:bg-[#489aa8]" aria-label="boton publicar oferta">
              <Link href="/jobs/new">Publicar</Link>
            </Button>

            {/* AQUÍ ESTÁ EL ICONO DE USUARIO EN DESKTOP */}
            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        {/* =======================================================
            SECCIÓN MOBILE (CELULAR)
            flex md:hidden -> Se ve en móvil, se oculta en PC
           ======================================================= */}
        <div className="flex md:hidden items-center gap-2">

          <ModeToggle />

          {/* El usuario también visible en la barra del celular */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* MENÚ HAMBURGUESA (Solo Mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="lg:w-15 lg:h-15  relative w-8 h-8">
                    <Link href="/" className="text-lg font-medium hover:text-[#5AB1C3]">
                      <Image
                        src="/logo.png"
                        alt="SoloJunior Logo"
                        width={80}  
                        height={80} 
                        priority 
                        className="rounded-full"   
                      />
                    </Link>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3">
                <SignedIn>
                  <Link href="/saved-jobs" className="text-lg font-medium hover:text-[#5AB1C3]">
                    ❤️ Guardados
                  </Link>

                  <Link href="/my-jobs" className="text-lg font-medium hover:text-[#5AB1C3]">
                    📋 Publicaciones
                  </Link>

                  <Button asChild className="bg-[#5AB1C3] text-white hover:bg-[#489aa8] w-full mt-2">
                    <Link href="/jobs/new">Publicar Oferta</Link>
                  </Button>
                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full mt-4">Ingresar / Registrarse</Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}