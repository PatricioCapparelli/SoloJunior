"use server";

import { prisma } from "@/lib/prisma"; 
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleJobSave(jobId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Debes estar logueado para guardar empleos.");
    }

    try {
        const existingSave = await prisma.savedJob.findUnique({
            where: {
                userId_jobId: {
                    userId,
                    jobId,
                },
            },
        });

        if (existingSave) {
            await prisma.savedJob.delete({
                where: {
                    id: existingSave.id,
                },
            });
            console.log("Empleo eliminado de favoritos");
        } else {
            await prisma.savedJob.create({
                data: {
                    userId,
                    jobId,
                },
            });
            console.log("Empleo guardado en favoritos");
        }
        revalidatePath("/jobs/[id]");
        revalidatePath("/");

        return { success: true };

    } catch (error) {
        console.error("Error al guardar empleo:", error);
        return { success: false, error: "Error interno del servidor" };
    }
}