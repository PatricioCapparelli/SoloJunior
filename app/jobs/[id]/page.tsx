import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Building2,
  CalendarClock,
  ArrowLeft,
  Eye,
  BadgeCheck
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import DeleteJobButton from "@/components/ui/DeleteJobButton";
import ReportJobButton from "@/components/ReportJobButton";

import sanitizeHtml from 'sanitize-html'; 

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return { title: "Oferta no encontrada" };

  return {
    title: `${job.title} en ${job.company}`,
    description: `Postulate a ${job.title} en ${job.company}. Modalidad: ${job.workMode}.`,
    openGraph: {
      title: `${job.title} en ${job.company} | SoloJunior`,
      description: `¡Buscamos ${job.title}! Modalidad ${job.workMode}. Aplicá ahora.`,
      images: [`/jobs/${job.id}/opengraph-image`],
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;

  let job;
  try {
    job = await prisma.job.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    job = await prisma.job.findUnique({ where: { id } });
  }

  if (!job) notFound();

  const { userId } = await auth();
  const isAdmin = userId === process.env.ADMIN_USER_ID;
  const isOwner = userId === job.userId;
  const canDelete = isAdmin || isOwner;

  const cleanDescription = sanitizeHtml(job.description, {
    allowedTags: [
      "b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre"
    ],
    allowedAttributes: {
      'a': [ 'href', 'target', 'rel' ], 
      'img': [ 'src', 'alt' ] 
    },
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' })
    }
  });

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">

      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-[#5AB1C3] transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Volver a empleos
        </Link>
      </div>

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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="shrink-0">
            {job.imageUrl ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                <Image src={job.imageUrl} alt={job.company} fill className="object-contain p-2" />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400">
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
                {job.verified && (
                  <span title="Empresa Verificada" className="flex items-center ml-1">
                    <BadgeCheck size={18} className="text-blue-500" fill="#dbeafe" />
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1"><MapPin size={18} /> Argentina</span>
              <span className="flex items-center gap-1"><Briefcase size={18} /> {job.workMode}</span>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="bg-[#5AB1C3] hover:bg-[#489aa8] text-white w-full md:w-auto shrink-0 font-semibold shadow-md transition-all hover:scale-105">
          <a href={job.url} target="_blank" rel="noopener noreferrer">Postularme Ahora 🚀</a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* DESCRIPCIÓN */}
        <div className="md:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Sobre el puesto</h2>
              
              {/* ✅ CAMBIO 3: Renderizado seguro */}
              <div 
                className="prose max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans"
                dangerouslySetInnerHTML={{ __html: cleanDescription }}
              />

            </CardContent>
          </Card>

          <div className="mt-8 flex justify-center opacity-70 hover:opacity-100 transition-opacity">
            <ReportJobButton jobId={job.id} />
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Nivel requerido</h3>
                <Badge className="text-md px-3 py-1" variant={job.seniority === 'PASANTIA' ? 'secondary' : 'default'}>
                  {job.seniority}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Publicado el</h3>
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <CalendarClock size={18} className="text-slate-400" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-[#5AB1C3] font-medium">
                  <Eye size={20} />
                  <span>{job.views} Vistas</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Personas interesadas en este puesto.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}