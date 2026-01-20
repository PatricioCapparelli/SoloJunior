"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Briefcase, Building2, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";

const formSchema = z.object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().min(10, "Contanos un poco más sobre el puesto"),
    seniority: z.enum(["PASANTIA", "TRAINEE", "JUNIOR"]),
    workMode: z.enum(["REMOTO", "HIBRIDO", "PRESENCIAL"]),
    company: z.string().min(2, "El nombre de la empresa es requerido"),
    url: z.string().url("Debe ser una URL válida (https://...)"),
    imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewJobPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            seniority: "TRAINEE",
            workMode: "REMOTO",
        },
    });

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            // 1. ERROR 429 (Rate Limit)
            if (response.status === 429) {
                toast.error("✋ ¡Epa! Estás publicando muy rápido. Esperá unos minutos.");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al publicar");
            }

            router.push("/");
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Hubo un error guardando el empleo. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-start min-h-screen py-10 px-4 bg-slate-50/50 dark:bg-black/20">

            <div className="w-full max-w-[600px] space-y-6">

                {/* Botón Volver (afuera de la card para limpiar visualmente) */}
                <div>
                    <Button variant="ghost" asChild className="-ml-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft size={18} />
                            Volver al listado
                        </Link>
                    </Button>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 pb-6">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="p-2 bg-[#5AB1C3]/10 rounded-lg">
                                <Sparkles className="text-[#5AB1C3] w-5 h-5" />
                            </div>
                            Publicar Oferta
                        </CardTitle>
                        <CardDescription>
                            La información será visible para todos los postulantes.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* BLOQUE 1: PUESTO */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título del Puesto <span className="text-red-500">*</span></Label>
                                    <Input id="title" placeholder="Ej: React Developer" {...register("title")} />
                                    {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nivel</Label>
                                        <Select onValueChange={(val) => setValue("seniority", val as any)} defaultValue="TRAINEE">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nivel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PASANTIA">🎓 Pasantía</SelectItem>
                                                <SelectItem value="TRAINEE">👶 Trainee</SelectItem>
                                                <SelectItem value="JUNIOR">🚀 Junior</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Modalidad</Label>
                                        <Select onValueChange={(val) => setValue("workMode", val as any)} defaultValue="REMOTO">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Modalidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="REMOTO">🏠 Remoto</SelectItem>
                                                <SelectItem value="HIBRIDO">🏢 Híbrido</SelectItem>
                                                <SelectItem value="PRESENCIAL">💼 Presencial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800" />

                            {/* BLOQUE 2: EMPRESA */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Empresa <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input id="company" placeholder="Nombre" className="pl-9" {...register("company")} />
                                        </div>
                                        {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="url">Link para aplicar <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input id="url" placeholder="https://..." className="pl-9" {...register("url")} />
                                        </div>
                                        {errors.url && <p className="text-red-500 text-xs">{errors.url.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Logo (Opcional)</Label>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                                        <ImageUpload
                                            value={watch("imageUrl") || ""}
                                            onChange={(url) => setValue("imageUrl", url)}
                                            onRemove={() => setValue("imageUrl", "")}
                                        />
                                    </div>
                                    <input type="hidden" {...register("imageUrl")} />
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800" />

                            {/* BLOQUE 3: DESCRIPCIÓN */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detalles del puesto, stack tecnológico, beneficios..."
                                    className="h-32 resize-none"
                                    {...register("description")}
                                />
                                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                            </div>

                            {/* FOOTER */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#5AB1C3] hover:bg-[#489aa8] text-white font-semibold h-12 text-base shadow-sm hover:shadow-md transition-all"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Publicando..." : "Publicar Oferta 🚀"}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}