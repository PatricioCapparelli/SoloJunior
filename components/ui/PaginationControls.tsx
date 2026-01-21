"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationControlsProps {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
}

export default function PaginationControls({
    hasNextPage,
    hasPrevPage,
    totalPages,
}: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = searchParams.get("page") ?? "1";
    const per_page = searchParams.get("per_page") ?? "10";

    return (
        <div className="flex items-center justify-center gap-4 mt-10">
            <Button
                variant="outline"
                size="sm"
                disabled={!hasPrevPage}
                onClick={() => {
                    router.push(`/?page=${Number(page) - 1}&per_page=${per_page}`);
                }}
                className="flex items-center gap-2"
            >
                <ArrowLeft size={16} /> Anterior
            </Button>

            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Página {page} de {totalPages}
            </div>

            <Button
                variant="outline"
                size="sm"
                disabled={!hasNextPage}
                onClick={() => {
                    router.push(`/?page=${Number(page) + 1}&per_page=${per_page}`);
                }}
                className="flex items-center gap-2"
            >
                Siguiente <ArrowRight size={16} />
            </Button>
        </div>
    );
}
