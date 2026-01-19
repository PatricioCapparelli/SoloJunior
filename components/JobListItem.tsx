import { Job } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, CalendarClock, Eye, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SaveJobButton from "./SaveJobButton";

interface JobListItemProps {
    job: Job;
    isSaved?: boolean;
}

export default function JobListItem({ job, isSaved = false }: JobListItemProps) {
    return (
        <Link href={`/jobs/${job.id}`} className="block group relative">
            <Card className="transition-all duration-300 hover:shadow-md hover:border-[#5AB1C3] dark:hover:border-[#5AB1C3] hover:-translate-y-1 h-full">
                <CardContent className="p-5 flex flex-col gap-4 h-full">

                    {/* --- HEADER DE LA CARD --- */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 items-start">

                            {/* 1. LOGO */}
                            <div className="shrink-0">
                                {job.imageUrl ? (
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                                        <Image
                                            src={job.imageUrl}
                                            alt={job.company}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400">
                                        <Building2 size={24} />
                                    </div>
                                )}
                            </div>

                            {/* 2. DATOS PRINCIPALES (Título y Empresa) */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#5AB1C3] transition-colors line-clamp-1">
                                    {job.title}
                                </h3>

                                {/* ACÁ VA LA EMPRESA CON EL TILDE AZUL (Restaurado) */}
                                <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                        <Building2 size={14} />
                                        {job.company}
                                        {/* Lógica del Verificado */}
                                        {job.verified && (
                                            <BadgeCheck size={14} className="text-blue-500 ml-0.5" />
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} /> Argentina
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. BOTÓN DE GUARDAR (Arriba a la derecha) */}
                        <div className="z-10 -mt-2 -mr-2">
                            <SaveJobButton jobId={job.id} initialIsSaved={isSaved} />
                        </div>
                    </div>

                    {/* --- FOOTER DE LA CARD (Badges y Stats) --- */}
                    <div className="mt-auto flex items-center justify-between pt-2">

                        {/* Badges de Modalidad y Seniority */}
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary" className="font-normal bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {job.workMode}
                            </Badge>
                            <Badge
                                className={`font-normal ${job.seniority === "PASANTIA" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" :
                                        job.seniority === "TRAINEE" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200" :
                                            "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                    }`}
                                variant="outline"
                            >
                                {job.seniority}
                            </Badge>
                        </div>

                        {/* Fecha y Vistas alineados a la derecha */}
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <CalendarClock size={12} />
                                {new Date(job.createdAt).toLocaleDateString()}
                            </span>

                            {job.views > 0 && (
                                <span className="text-xs font-medium text-[#5AB1C3] flex items-center gap-1 animate-in fade-in">
                                    <Eye size={12} />
                                    {job.views}
                                </span>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </Link>
    );
}