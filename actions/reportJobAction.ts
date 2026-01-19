"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reportJob(jobId: string, reason: string, details: string) {
    try {
        await prisma.report.create({
            data: {
                jobId,
                reason,
                details,
            },
        });


        return { success: true };
    } catch (error) {
        console.error("Error al reportar:", error);
        return { success: false, error: "No se pudo enviar el reporte." };
    }
}   