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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ui/ImageUpload";

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "Contanos un poco más sobre el puesto"),
  seniority: z.enum(["PASANTIA", "TRAINEE", "JUNIOR"]),
  workMode: z.enum(["REMOTO", "HIBRIDO", "PRESENCIAL"]),
  company: z.string().min(2, "El nombre de la empresa es requerido"),
  url: z.string().url("Debe ser una URL válida (https://...)"),
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

  // Función que se ejecuta al enviar
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al publicar");

      // Si todo sale bien, volvemos al Home para ver la oferta
      router.push("/");
      router.refresh(); // Refresca los datos del servidor
    } catch (error) {
      alert("Hubo un error guardando el empleo. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Publicar nueva oportunidad 🚀
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título del Puesto</Label>
              <Input id="title" placeholder="Ej: Desarrollador Frontend React" {...register("title")} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Empresa y URL (en 2 columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Ej: Mercado Libre" {...register("company")} />
                {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Link para aplicar</Label>
                <Input id="url" placeholder="https://..." {...register("url")} />
                {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
              </div>
            </div>

            {/* Seniority y Modalidad (Selects) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Seniority (Bloqueado a Junior)</Label>
                <Select onValueChange={(val) => setValue("seniority", val as any)} defaultValue="TRAINEE">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASANTIA">Pasantía (Estudiantes)</SelectItem>
                    <SelectItem value="TRAINEE">Trainee (Sin experiencia)</SelectItem>
                    <SelectItem value="JUNIOR">Junior (Hasta 2 años)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modalidad</Label>
                <Select onValueChange={(val) => setValue("workMode", val as any)} defaultValue="REMOTO">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTO">100% Remoto</SelectItem>
                    <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* LOGO DE EMPRESA */}
            <div className="space-y-2">
              <Label>Logo de la Empresa (Opcional)</Label>
              <ImageUpload
                value={watch("imageUrl") || ""} 
                onChange={(url) => setValue("imageUrl", url)} 
                onRemove={() => setValue("imageUrl", "")} 
              />
              <input type="hidden" {...register("imageUrl")} />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description" 
                placeholder="Contanos los requisitos, beneficios y stack tecnológico..." 
                className="h-32"
                {...register("description")} 
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : "Publicar Oferta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}