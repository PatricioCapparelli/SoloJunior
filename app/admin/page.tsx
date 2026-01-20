import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteReport,
  deleteJobAndReport,
  toggleJobApproval, // ⚠️ Asegurate de haber agregado esta función en adminActions.ts
} from "@/actions/adminActions";
import Link from "next/link";
import {
  Trash2,
  CheckCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";

export default async function AdminPage() {
  // 1. SEGURIDAD: Solo entra el Admin
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    redirect("/"); // Si no es admin, chau
  }

  // 2. BUSCAR DATOS (Usamos Promise.all para que cargue rápido en paralelo)
  const [reports, pendingJobs] = await Promise.all([
    // A. Buscar Reportes
    prisma.report.findMany({
      include: { job: true },
      orderBy: { createdAt: "desc" },
    }),
    // B. Buscar Pendientes de Aprobación
    prisma.job.findMany({
      where: { approved: false },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        🛡️ Panel de Moderación
      </h1>

      <div className="space-y-10">
        
        {/* --- SECCIÓN 1: PENDIENTES DE APROBACIÓN --- */}
        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-500">
              <Clock className="w-5 h-5" />
              Pendientes de Aprobación
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
                {pendingJobs.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Ofertas nuevas que necesitan tu "Ok" para aparecer en el inicio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingJobs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-green-500/50" />
                <p>¡Estás al día! No hay ofertas pendientes.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          className="hover:underline flex items-center gap-1 group"
                        >
                          {job.title} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="text-xs text-slate-400">{job.workMode} • {job.seniority}</div>
                      </TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* APROBAR */}
                        <form action={toggleJobApproval.bind(null, job.id, false)} className="inline">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                            <CheckCircle2 size={16} className="mr-1" /> Aprobar
                          </Button>
                        </form>

                        {/* RECHAZAR (Borrar) */}
                        <form action={deleteJobAndReport.bind(null, job.id)} className="inline">
                          <Button size="sm" variant="destructive" title="Rechazar y borrar">
                            <XCircle size={16} className="mr-1" /> Rechazar
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* --- SECCIÓN 2: REPORTES DE COMUNIDAD --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Reportes de Usuarios
              {reports.length > 0 && (
                 <Badge variant="destructive" className="ml-2">
                    {reports.length}
                 </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Denuncias realizadas por la comunidad en ofertas visibles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                ✅ No hay reportes pendientes. ¡Todo tranquilo!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Empleo Reportado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium capitalize text-red-600">
                        {report.reason}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm max-w-[200px] truncate" title={report.details || ""}>
                        {report.details || "-"}
                      </TableCell>
                      <TableCell>
                         {report.job ? (
                            <>
                                <Link
                                href={`/jobs/${report.jobId}`}
                                className="text-blue-500 hover:underline flex items-center gap-1 font-medium"
                                target="_blank"
                                >
                                {report.job.title} <ExternalLink size={12} />
                                </Link>
                                <div className="text-xs text-slate-400">{report.job.company}</div>
                            </>
                         ) : (
                            <span className="text-slate-400 italic">Empleo ya borrado</span>
                         )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* IGNORAR REPORTE */}
                        <form action={deleteReport.bind(null, report.id)} className="inline">
                          <Button size="sm" variant="outline" title="Descartar reporte (Mantener empleo)">
                            <CheckCircle size={16} className="mr-1 text-green-600" />
                            Mantener
                          </Button>
                        </form>

                        {/* BORRAR EMPLEO (Banear) */}
                        <form action={deleteJobAndReport.bind(null, report.jobId)} className="inline">
                          <Button size="sm" variant="destructive" title="Borrar empleo y reporte">
                            <Trash2 size={16} className="mr-1" />
                            Banear
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}