"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    // Ejecutamos la promesa
    toast.promise(
      async () => {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Error al borrar");
        }

        return response;
      },
      {
        loading: "Eliminando oferta...",
        success: () => {
          // Si sale bien, redirigimos al home porque esta página ya no existe
          router.push("/"); 
          router.refresh();
          return "Oferta eliminada correctamente 🗑️";
        },
        error: (err) => {
          setIsDeleting(false); // Reactivamos el botón si falló
          return "Error: No se pudo eliminar la oferta";
        },
      }
    );
  };

  return (
    <AlertDialog>
      
      {/* EL BOTÓN QUE ABRE EL DIÁLOGO */}
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 size={16} />
          Eliminar
        </Button>
      </AlertDialogTrigger>

      {/* EL DIÁLOGO DE CONFIRMACIÓN */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la oferta de trabajo y todos sus datos asociados de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); 
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Borrando...
              </>
            ) : (
              "Sí, eliminar oferta"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}