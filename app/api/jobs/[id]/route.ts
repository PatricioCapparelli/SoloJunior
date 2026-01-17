import { z } from "zod";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const editSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    seniority: z.enum(["PASANTIA", "TRAINEE", "JUNIOR"]).optional(),
    workMode: z.enum(["REMOTO", "HIBRIDO", "PRESENCIAL"]).optional(),
    company: z.string().min(2).optional(),
    url: z.string().url().optional(),
});

// GET: Obtener un solo trabajo (para rellenar el form de edición)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({ where: { id } });
        if (!job) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

// DELETE: Borrar una oferta
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Next.js 15: params es promesa
) {
    try {
        // 1. Verificamos usuario logueado
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // 2. Obtenemos el ID de la URL
        const { id } = await params;

        // 3. Buscamos el trabajo para ver si existe y DE QUIÉN es
        const job = await prisma.job.findUnique({
            where: { id },
        });

        if (!job) {
            return NextResponse.json({ error: "Trabajo no encontrado" }, { status: 404 });
        }

        // 4. EL CHECK DE SEGURIDAD MÁS IMPORTANTE
        // ¿El que quiere borrar es el mismo que lo creó?
        if (job.userId !== userId) {
            return NextResponse.json({ error: "Prohibido: No es tu oferta" }, { status: 403 });
        }

        // 5. Si pasó todo, borramos
        await prisma.job.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

// PATCH: Editar una oferta
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const { id } = await params;
        const body = await request.json();

        // 1. Validamos los datos que llegan
        const validation = editSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        // 2. Verificamos que el trabajo exista y sea del usuario
        const job = await prisma.job.findUnique({ where: { id } });

        if (!job) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        if (job.userId !== userId) return NextResponse.json({ error: "Prohibido" }, { status: 403 });

        // 3. Actualizamos solo los campos que vinieron
        const updatedJob = await prisma.job.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json(updatedJob);

    } catch (error) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}