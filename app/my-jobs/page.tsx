import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import DeleteJobButton from "@/components/ui/DeleteJobButton";
import { Pencil } from "lucide-react";

const prisma = new PrismaClient();

export default async function MyJobsPage() {
  const { userId } = await auth();

  // Si no está logueado, lo mandamos al login
  if (!userId) {
    redirect("/");
  }

  // Buscamos SOLO los trabajos de este usuario
  const jobs = await prisma.job.findMany({
    where: {
      userId: userId, // <--- EL FILTRO MÁGICO
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Mis Publicaciones 💼</h1>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-500 mb-4">Todavía no publicaste ninguna oferta.</p>
          <Button asChild>
            <Link href="/jobs/new">Publicar la primera</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="border-slate-200">
              <CardHeader>
                <div className="flex justify-between">
                  <Badge variant="outline">{job.seniority}</Badge>
                  <span className={`text-xs px-2 py-1 rounded-full ${job.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {job.active ? 'Activa' : 'Cerrada'}
                  </span>
                </div>
                <CardTitle className="mt-2">{job.title}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between gap-2 pt-4 border-t border-slate-100">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/jobs/${job.id}`}>Ver detalle</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="mr-2">
                  <Link href={`/jobs/${job.id}/edit`}>
                    <Pencil size={16} />
                  </Link>
                </Button>
                <DeleteJobButton jobId={job.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}