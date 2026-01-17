import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2 } from "lucide-react"; 
import JobFilter from '@/components/ui/JobFilter';
import Image from "next/image"; 

const prisma = new PrismaClient();

async function getJobs(query: string) {
  const jobs = await prisma.job.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    },
    orderBy: { createdAt: 'desc' },
  });
  return jobs;
}

export default async function Home(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  const jobs = await getJobs(query);

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-4">
          Solo<span className="text-blue-600">Junior</span> 🚀
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          La bolsa de trabajo donde la experiencia de 5 años NO es un requisito.
        </p>

        <JobFilter />

        <Button asChild size="lg">
          <Link href="/jobs/new">Publicar un Empleo Gratis</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow border-slate-200">

            {/* CAMBIO PRINCIPAL: Modificamos el Header para incluir la imagen */}
            <CardHeader>
              <div className="flex gap-4 items-start">

                {/* 1. LÓGICA DEL LOGO (Izquierda) */}
                <div className="flex-shrink-0">
                  {job.imageUrl ? (
                    <div className="relative h-12 w-12 rounded-md border border-slate-200 overflow-hidden">
                      <Image
                        src={job.imageUrl}
                        alt={job.company}
                        fill
                        className="object-contain p-1" // p-1 para que no toque los bordes si es muy grande
                      />
                    </div>
                  ) : (
                    // Si no tiene logo, mostramos el edificio gris por defecto
                    <div className="h-12 w-12 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                      <Building2 size={24} />
                    </div>
                  )}
                </div>

                {/* 2. DATOS DEL TITULO (Derecha) */}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <Badge variant={job.seniority === 'PASANTIA' ? 'secondary' : 'default'}>
                      {job.seniority}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>

                  <CardDescription className="flex items-center gap-1">
                    {job.company}
                  </CardDescription>
                </div>

              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {job.description}
              </p>
              <div className="flex gap-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {job.workMode}
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href={`/jobs/${job.id}`}>
                  Ver más detalles
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center text-slate-500 py-20">
          <p>No encontramos ofertas para "{query}".</p>
          {query && (
            <Button variant="link" asChild>
              <Link href="/">Ver todas</Link>
            </Button>
          )}
        </div>
      )}
    </main>
  );
}