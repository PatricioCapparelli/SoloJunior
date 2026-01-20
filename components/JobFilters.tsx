"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// ✅ CORREGIDO: Solo niveles iniciales. Chau Semi Senior.
const seniorities = ["PASANTIA", "TRAINEE", "JUNIOR"];
const workModes = ["REMOTO", "HIBRIDO", "PRESENCIAL"];

export default function JobFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = params.get(key)?.split(",") || [];

        let updated;
        if (current.includes(value)) {
            updated = current.filter((item) => item !== value);
        } else {
            updated = [...current, value];
        }

        if (updated.length > 0) {
            params.set(key, updated.join(","));
        } else {
            params.delete(key);
        }

        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const isChecked = (key: string, value: string) => {
        const current = searchParams.get(key)?.split(",") || [];
        return current.includes(value);
    };

    return (
        <div className="space-y-8">
            {/* SECCIÓN SENIORITY */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Nivel</h3>
                <div className="space-y-3">
                    {seniorities.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                                id={`sen-${item}`}
                                checked={isChecked("seniority", item)}
                                onCheckedChange={() => handleFilterChange("seniority", item)}
                            />
                            <Label htmlFor={`sen-${item}`} className="cursor-pointer capitalize text-sm">
                                {item.toLowerCase()}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECCIÓN MODALIDAD */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Modalidad</h3>
                <div className="space-y-3">
                    {workModes.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                                id={`mode-${item}`}
                                checked={isChecked("workMode", item)}
                                onCheckedChange={() => handleFilterChange("workMode", item)}
                            />
                            <Label htmlFor={`mode-${item}`} className="cursor-pointer capitalize text-sm">
                                {item.toLowerCase()}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTÓN LIMPIAR */}
            {(searchParams.get("seniority") || searchParams.get("workMode")) && (
                <Button
                    variant="outline"
                    className="w-full text-xs mt-4 hover:bg-red-50 hover:text-red-600 border-red-200"
                    onClick={() => router.push("/")}
                >
                    Borrar filtros 🗑️
                </Button>
            )}
        </div>
    );
}