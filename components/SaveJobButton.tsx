"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTransition, useState, useEffect } from "react";
import { toggleJobSave } from "@/actions/saveJobAction"; 
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SaveJobButtonProps {
    jobId: string;
    initialIsSaved: boolean;
}

export default function SaveJobButton({ jobId, initialIsSaved }: SaveJobButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isSaved, setIsSaved] = useState(initialIsSaved);

    useEffect(() => {
        setIsSaved(initialIsSaved);
    }, [initialIsSaved]);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation(); 

        const newState = !isSaved;
        setIsSaved(newState);

        startTransition(async () => {
            const result = await toggleJobSave(jobId);

            if (!result.success) {
                setIsSaved(!newState);
                toast.error("Error al guardar");
                console.error(result.error);
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={isPending}
            className="hover:bg-transparent group"
        >
            <Heart
                size={24}
                className={cn(
                    "transition-all duration-300",
                    isSaved
                        ? "fill-red-500 text-red-500 scale-110" 
                        : "text-slate-400 group-hover:text-red-400 group-hover:scale-110" 
                )}
            />
        </Button>
    );
}