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

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2">
          <ArrowLeft size={16} /> Volver a empleos
        </Link>
      </div>

      {/* ENCABEZADO PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        
        {/* GRUPO: LOGO + TEXTOS */}
        <div className="flex items-center gap-4 w-full md:w-auto">
            
            {/* 2. LÓGICA DE LA IMAGEN (Más grande que en el Home) */}
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

            {/* DATOS DE LA EMPRESA */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-600 text-sm sm:text-base">
                <span className="flex items-center gap-1 font-medium text-slate-900">
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
        
        {/* BOTÓN DE ACCIÓN (A la derecha en PC, abajo en móvil) */}
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto shrink-0">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            Postularme Ahora 🚀
          </a>
        </Button>
      </div>

      {/* RESTO DEL CONTENIDO (Igual que antes) */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sobre el puesto</h2>
              <div className="prose max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
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
                <div className="flex items-center gap-2 text-slate-900">
                  <CalendarClock size={16} />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
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