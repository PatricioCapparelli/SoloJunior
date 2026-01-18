import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b bg-white dark:bg-slate-950 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO + TEXTO */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">

          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <Image
              src="/logo.png"
              alt="SoloJunior Logo"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>

          <span className="font-bold text-xl text-slate-900 dark:text-white">
            Solo<span className="text-[#5AB1C3]">Junior</span> {/* <--- COLOR NEÓN AQUÍ */}
          </span>
        </Link>

        {/* MENÚ */}
        <div className="flex items-center gap-4">

          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#5AB1C3] transition-colors"> {/* <--- HOVER NEÓN */}
            Buscar
          </Link>

          <ModeToggle />

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Ingresar</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/my-jobs"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#5AB1C3] mr-2 transition-colors"
            >
              Mis Jobs
            </Link>

            {/* BOTÓN PUBLICAR CON EL COLOR NEÓN */}
            <Button asChild variant="default" size="sm" className="bg-[#5AB1C3] text-white hover:bg-[#489aa8]">
              <Link href="/jobs/new">Publicar</Link>
            </Button>

            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

        </div>
      </div>
    </nav>
  );
}