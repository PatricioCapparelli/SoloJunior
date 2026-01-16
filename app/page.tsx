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
import { Briefcase, MapPin, Building2 } from "lucide-react";
import JobFilter from '@/components/ui/JobFilter';

const prisma = new PrismaClient();

// Modificamos la función para aceptar un término de búsqueda
async function getJobs(query: string) {
  const jobs = await prisma.job.findMany({
    where: {
      OR: [ // Busca SI el título contiene X O la empresa contiene X
        { title: { contains: query, mode: 'insensitive' } }, // insensitive = ignora mayúsculas
        { company: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    },
    orderBy: { createdAt: 'desc' },
  });
  return jobs;
}

// Next.js 15: searchParams es una Promise
export default async function Home(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || ""; // Si no hay búsqueda, es texto vacío

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
        
        <JobFilter/>

        <Button asChild size="lg">
          <Link href="/jobs/new">Publicar un Empleo Gratis</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow border-slate-200">
             <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={job.seniority === 'PASANTIA' ? 'secondary' : 'default'} className="mb-2">
                  {job.seniority}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building2 className="w-3 h-3" /> {job.company}
              </CardDescription>
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

      {/* Mensaje si la búsqueda no da resultados */}
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