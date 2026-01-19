import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
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
import { deleteReport, deleteJobAndReport } from "@/actions/adminActions";
import Link from "next/link";
import { Trash2, CheckCircle, ExternalLink } from "lucide-react";

export default async function AdminPage() {
    // 1. SEGURIDAD: Solo entra el Admin
    const { userId } = await auth();
    if (userId !== process.env.ADMIN_USER_ID) {
        redirect("/"); // Si no es admin, chau
    }

    // 2. BUSCAR REPORTES
    const reports = await prisma.report.findMany({
        include: {
            job: true, 
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">🛡️ Panel de Moderación</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Reportes Pendientes</CardTitle>
                        <CardDescription>
                            Revisá las denuncias de la comunidad.
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
                                            <TableCell>
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="font-medium capitalize">
                                                {report.reason}
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-sm max-w-xs truncate">
                                                {report.details || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/jobs/${report.jobId}`}
                                                    className="text-blue-500 hover:underline flex items-center gap-1"
                                                    target="_blank"
                                                >
                                                    {report.job.title} <ExternalLink size={12} />
                                                </Link>
                                                <div className="text-xs text-slate-400">{report.job.company}</div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">

                                                {/* BOTÓN: IGNORAR (Borra solo el reporte) */}
                                                <form action={deleteReport.bind(null, report.id)} className="inline">
                                                    <Button size="sm" variant="outline" title="Descartar reporte">
                                                        <CheckCircle size={16} className="mr-1 text-green-600" />
                                                        Mantener
                                                    </Button>
                                                </form>

                                                {/* BOTÓN: BORRAR EMPLEO (Borra el post y el reporte) */}
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