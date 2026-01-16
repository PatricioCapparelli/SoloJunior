import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // <--- Importaciones nuevas

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/75 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Code2 size={24} />
          </div>
          Solo<span className="text-blue-600">Junior</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Buscar Empleos
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Ingresar</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {/* Link NUEVO */}
            <Link 
              href="/my-jobs" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 mr-4"
            >
              Mis Publicaciones
            </Link>

            <Button asChild variant="default" size="sm">
              <Link href="/jobs/new">Publicar Oferta</Link>
            </Button>
            
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

        </div>
      </div>
    </nav>
  );
}