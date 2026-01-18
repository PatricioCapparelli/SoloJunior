import { Job } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building2, CalendarClock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface JobListItemProps {
    job: Job;
}

export default function JobListItem({ job }: JobListItemProps) {
    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <Card className="transition-all duration-300 hover:shadow-md hover:border-[#5AB1C3] dark:hover:border-[#5AB1C3] hover:-translate-y-1">
                <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">

                    {/* LOGO DE LA EMPRESA */}
                    <div className="flex-shrink-0">
                        {job.imageUrl ? (
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                                <Image
                                    src={job.imageUrl}
                                    alt={job.company}
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400">
                                <Building2 size={24} />
                            </div>
                        )}
                    </div>

                    {/* INFORMACIÓN PRINCIPAL */}
                    <div className="flex-grow space-y-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#5AB1C3] transition-colors">
                            {job.title}
                        </h3>

                        <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                <Building2 size={14} /> {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> Argentina
                            </span>
                        </div>
                    </div>

                    {/* ETIQUETAS Y FECHA (Derecha) */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto justify-between sm:justify-center mt-2 sm:mt-0">

                        <div className="flex gap-2">
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

                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <CalendarClock size={12} />
                            {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                </CardContent>
            </Card>
        </Link>
    );
}