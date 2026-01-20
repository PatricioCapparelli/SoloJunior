import JobListItem from "@/components/JobListItem";
import JobFilters from "@/components/JobFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

// --- BACKEND ---
async function getJobs(query?: string, seniority?: string, workMode?: string) {
  const where: any = { 
    AND: [ 
      { approved: true } 
    ] 
  };

  if (query) {
    where.AND.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (seniority) {
    const levels = seniority.split(",");
    where.AND.push({ seniority: { in: levels } });
  }

  if (workMode) {
    const modes = workMode.split(",");
    where.AND.push({ workMode: { in: modes } });
  }

  if (where.AND.length === 0) delete where.AND;

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return jobs;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; seniority?: string; workMode?: string }>;
}) {
  const { q, seniority, workMode } = await searchParams;
  const jobs = await getJobs(q, seniority, workMode);

  const { userId } = await auth();
  let savedJobIds: string[] = [];

  if (userId && jobs.length > 0) {
    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId,
        jobId: { in: jobs.map((job) => job.id) },
      },
      select: { jobId: true },
    });
    savedJobIds = savedJobs.map((s) => s.jobId);
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10 items-start">

        {/* 1. HEADER (PRIMERO EN EL CÓDIGO = PRIMERO EN CELULAR) */}
        <section className="lg:col-start-2 shadow-sm text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex flex-row sm:flex-row items-center justify-center gap-4 mb-6">
              <span>Solo<span className="text-[#5AB1C3]">Junior</span></span>
              <div className="relative w-16 h-16 shrink-0 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain drop-shadow-lg rounded-full border border-slate-200 dark:border-slate-700"
                  priority
                />
              </div>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-6">
              La bolsa de trabajo donde la experiencia de 5 años <span className="font-bold text-slate-900 dark:text-white">NO</span> es un requisito.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative grow">
                <Search className="absolute left-3 top-2.5 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                <Input
                  type="text"
                  name="q"
                  placeholder="Tecnología o empresa..."
                  className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                  defaultValue={q}
                />
              </div>
              <Button type="submit" size="lg" className="h-11 bg-[#5AB1C3] hover:bg-[#489aa8] text-white font-semibold cursor-pointer">
                Buscar
              </Button>
            </form>

            <div className="mt-4">
              <Button asChild variant="link" size="sm" className="text-[#5AB1C3] hover:text-[#489aa8]">
                <Link href="/jobs/new">Publicar oferta gratis →</Link>
              </Button>
            </div>
        </section>

        {/* 2. FILTROS (SEGUNDO EN EL CÓDIGO = SEGUNDO EN CELULAR) */}
        <aside className="lg:col-start-1 lg:row-start-1 lg:row-span-full lg:sticky lg:top-24">
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <JobFilters />
          </div>
        </aside>

        {/* 3. OFERTAS (TERCERO EN EL CÓDIGO = TERCERO EN CELULAR) */}
        <section className="lg:col-start-2">
            <div className="mb-4 text-slate-500 text-sm font-medium ml-1">
              {jobs.length === 1 ? '1 oferta encontrada' : `${jobs.length} ofertas encontradas`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.includes(job.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xl mb-2 font-semibold">No encontramos ofertas 😢</p>
                  <p className="text-sm mb-4 text-slate-500">Probá cambiando los filtros o la búsqueda.</p>
                  <Button variant="outline" asChild>
                    <Link href="/">Limpiar todo</Link>
                  </Button>
                </div>
              )}
            </div>
        </section>

      </div>
    </main>
  );
}