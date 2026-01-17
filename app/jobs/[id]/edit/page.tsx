"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams(); 
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue } = useForm();

  // 1. Al cargar la página, pedimos los datos actuales del trabajo
  useEffect(() => {
    fetch(`/api/jobs/${params.id}`) // Usamos la API GET que ya existe (necesitamos crearla en paso 3 si falla)
      .then((res) => res.json())
      .then((data) => {
        // Rellenamos el formulario con los datos que vinieron
        setValue("title", data.title);
        setValue("company", data.company);
        setValue("url", data.url);
        setValue("description", data.description);
        setValue("seniority", data.seniority);
        setValue("workMode", data.workMode);
        setLoading(false);
      })
      .catch(() => alert("Error cargando datos"));
  }, [params.id, setValue]);

  // 2. Función para guardar los cambios (PATCH)
  const onSubmit = async (data: any) => {
    toast.promise(
      fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (!res.ok) throw new Error("Error");
      }),
      {
        loading: 'Guardando cambios...',
        success: () => {
          router.push("/my-jobs");
          router.refresh();
          return '¡Oferta actualizada con éxito! 🎉';
        },
        error: 'Hubo un error al guardar ❌',
      }
    );
  };

  if (loading) return <div className="text-center py-20">Cargando datos...</div>;

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <Link href="/my-jobs" className="flex items-center gap-2 text-slate-500 mb-6 hover:text-blue-600">
        <ArrowLeft size={16} /> Cancelar y volver
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Editar Oferta ✏️</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <Label>Título</Label>
              <Input {...register("title")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input {...register("company")} />
              </div>
              <div className="space-y-2">
                <Label>Link</Label>
                <Input {...register("url")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {/* Ojo: Los Selects en React Hook Form manual necesitan control, 
                   pero para simplificar usamos el defaultValue que seteamos antes */}
              <div className="space-y-2">
                <Label>Seniority</Label>
                <Select onValueChange={(val) => setValue("seniority", val)} defaultValue={undefined}>
                  <SelectTrigger><SelectValue placeholder="Cambiar nivel..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASANTIA">Pasantía</SelectItem>
                    <SelectItem value="TRAINEE">Trainee</SelectItem>
                    <SelectItem value="JUNIOR">Junior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modalidad</Label>
                <Select onValueChange={(val) => setValue("workMode", val)} defaultValue={undefined}>
                  <SelectTrigger><SelectValue placeholder="Cambiar modalidad..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTO">Remoto</SelectItem>
                    <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea {...register("description")} className="h-32" />
            </div>

            <Button type="submit" className="w-full bg-blue-600">Guardar Cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}