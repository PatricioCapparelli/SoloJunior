import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  CalendarClock, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image"; 
import { auth } from "@clerk/nextjs/server"; 
import DeleteJobButton from "@/components/ui/DeleteJobButton";

const prisma = new PrismaClient();

async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id: id },
  });
  
  if (!job) notFound(); 
  return job;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params; 
  const job = await getJob(id);

  // --- LÓGICA DE ADMIN / DUEÑO (NUEVO) ---
  const { userId } = await auth();
  
  // Verificamos si es el Admin (con la variable de entorno)
  const isAdmin = userId === process.env.ADMIN_USER_ID;
  // Verificamos si es el dueño de la oferta
  const isOwner = userId === job.userId;
  
  // Puede borrar si cumple cualquiera de las dos
  const canDelete = isAdmin || isOwner;
  // ----------------------------------------

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2">
          <ArrowLeft size={16} /> Volver a empleos
        </Link>
      </div>

      {/* --- PANEL DE ADMIN (SOLO SE VE SI TENÉS PERMISO) --- */}
      {canDelete && (
         <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-md mb-6 flex justify-between items-center animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col">
                <span className="text-sm font-bold flex items-center gap-2">
                  {isAdmin ? "🛡️ MODO ADMIN" : "👤 GESTIONAR TU OFERTA"}
                </span>
                <span className="text-xs opacity-80">
                  Tenés permiso para eliminar esta publicación permanentemente.
                </span>
            </div>
            <DeleteJobButton jobId={job.id} />
         </div>
      )}
      {/* --------------------------------------------------- */}

      {/* ENCABEZADO PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        {/* ... (Todo el resto de tu código sigue igual acá abajo) ... */}
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-shrink-0">
              {job.imageUrl ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <Image
                    src={job.imageUrl}
                    alt={job.company}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                  <Building2 size={32} />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                <span className="flex items-center gap-1 font-medium text-slate-900 dark:text-slate-200">
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={18} /> Argentina
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase size={18} /> {job.workMode}
                </span>
              </div>
            </div>
        </div>
        
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto shrink-0">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            Postularme Ahora 🚀
          </a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sobre el puesto</h2>
              <div className="prose max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Nivel requerido</h3>
                <Badge className="text-md px-3 py-1" variant={job.seniority === 'PASANTIA' ? 'secondary' : 'default'}>
                  {job.seniority}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Publicado el</h3>
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <CalendarClock size={16} />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">
                  ID: {job.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}