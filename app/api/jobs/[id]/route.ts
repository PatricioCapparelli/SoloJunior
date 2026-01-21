import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ USAMOS LA INSTANCIA GLOBAL (Evita colapsar la DB)
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

// Esquema de validación para edición (campos opcionales)
const editSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    seniority: z.enum(["PASANTIA", "TRAINEE", "JUNIOR"]).optional(),
    workMode: z.enum(["REMOTO", "HIBRIDO", "PRESENCIAL"]).optional(),
    company: z.string().min(2).optional(),
    url: z.string().url().optional(),
    imageUrl: z.string().optional(),
});

// GET: Obtener un solo trabajo
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({ where: { id } });

        if (!job) {
            return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

// DELETE: Borrar una oferta (Protegido contra IDOR)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { id } = await params;

        // 1. Buscamos el trabajo
        const job = await prisma.job.findUnique({
            where: { id },
        });

        if (!job) {
            return NextResponse.json({ error: "Trabajo no encontrado" }, { status: 404 });
        }

        // 2. 🛡️ CHECK ANTI-IDOR (Dueño o Admin)
        const isOwner = job.userId === userId;
        const isAdmin = userId === process.env.ADMIN_USER_ID;

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: "⛔ Prohibido: No tenés permiso para borrar esto." }, { status: 403 });
        }

        // 3. Borramos
        await prisma.job.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

// PATCH: Editar una oferta (Protegido contra IDOR)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // 1. Validamos los datos con Zod
        const validation = editSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        // 2. Buscamos el trabajo
        const job = await prisma.job.findUnique({ where: { id } });

        if (!job) {
            return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        }

        // 3. 🛡️ CHECK ANTI-IDOR (Dueño o Admin)
        // ⚠️ Corrección clave: Antes tu código no dejaba editar al Admin. Ahora sí.
        const isOwner = job.userId === userId;
        const isAdmin = userId === process.env.ADMIN_USER_ID;

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: "⛔ Prohibido: No podés editar ofertas ajenas." }, { status: 403 });
        }

        // 4. Actualizamos
        const updatedJob = await prisma.job.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json(updatedJob);

    } catch (error) {
        console.error("Patch Error:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}