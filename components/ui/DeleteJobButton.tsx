"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    toast.promise(
      fetch(`/api/jobs/${jobId}`, { method: "DELETE" }).then(async (res) => {
        if (!res.ok) throw new Error("Error");
        return res; 
      }),
      {
        loading: 'Borrando oferta...',
        success: () => {
          router.refresh();
          return 'Oferta eliminada correctamente 🗑️';
        },
        error: 'No se pudo borrar la oferta ❌',
      }
    );
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete} 
      className="gap-2"
    >
      <Trash2 size={16} />
      Eliminar
    </Button>
  );
}