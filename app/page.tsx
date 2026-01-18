import JobListItem from "@/components/JobListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrismaClient } from "@prisma/client";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

async function getJobs(query?: string) {
  const where = query
    ? {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { company: { contains: query, mode: "insensitive" as const } },
      ],
    }
    : {};

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return jobs;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const jobs = await getJobs(q);

  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">

      {/* --- HERO SECTION --- */}
      <div className="text-center mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* 1. TÍTULO CON LOGO GRANDE AL LADO */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-4 sm:gap-6">
          <span>Solo<span className="text-[#5AB1C3]">Junior</span></span>

          <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 hover:scale-110 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Yaguareté Cibernético"
              fill
              className="object-contain drop-shadow-lg rounded-full border border-slate-200 dark:border-slate-700"
              priority
            />
          </div>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          La bolsa de trabajo donde la experiencia de 5 años <span className="font-bold text-slate-900 dark:text-white">NO</span> es un requisito.
        </p>

        <form className="flex flex-row sm:flex-row gap-3 max-w-xl mx-auto mt-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            <Input
              type="text"
              name="q"
              placeholder="Buscar por tecnología o empresa..."
              className="pl-10 h-12 text-base bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              defaultValue={q}
            />
          </div>
          <Button type="submit" size="lg" className="h-12 bg-[#5AB1C3] hover:bg-[#489aa8] text-white transition-colors font-semibold">
            Buscar
          </Button>
        </form>

        {/* 3. Botón "Publicar": Limpio, sin logo */}
        <div className="mt-6">
          <Button asChild variant="outline" size="sm" className="gap-2 border-[#5AB1C3] text-[#5AB1C3] hover:bg-[#5AB1C3]/10 dark:border-[#5AB1C3] dark:text-[#5AB1C3] hover:text-[#5AB1C3]">
            <Link href="/jobs/new">
              Publicar una oferta gratis
            </Link>
          </Button>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto animate-in fade-in duration-700 delay-300">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobListItem key={job.id} job={job} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-lg mb-2">No encontramos ofertas para esa búsqueda 😢</p>
            <p className="text-sm">¡Probá con otros términos!</p>
          </div>
        )}
      </div>
    </main>
  );
}