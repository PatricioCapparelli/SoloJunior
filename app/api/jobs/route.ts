import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

// Instancia global de Prisma
const prisma = new PrismaClient();

// Esquema de validación estricto
const createJobSchema = z.object({
    title: z.string().min(3, "El título es muy corto"),
    description: z.string().min(10, "La descripción es muy corta"),
    seniority: z.enum(['PASANTIA', 'TRAINEE', 'JUNIOR']),
    workMode: z.enum(['REMOTO', 'HIBRIDO', 'PRESENCIAL']),
    company: z.string().min(2),
    url: z.string().url("Debe ser una URL válida"),
});

// Crear un nuevo trabajo
export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await request.json();

        const validation = createJobSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: validation.error.format() },
                { status: 400 }
            );
        }

        // Guardar en PostgreSQL
        const newJob = await prisma.job.create({
            data: {
                title: validation.data.title,
                description: validation.data.description,
                seniority: validation.data.seniority,
                workMode: validation.data.workMode,
                company: validation.data.company,
                url: validation.data.url,
            },
        });

        return NextResponse.json(newJob, { status: 201 });

    } catch (error) {
        console.error("Error creando job:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const jobs = await prisma.job.findMany({
            orderBy: { createdAt: 'desc' } 
        });
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener trabajos" }, { status: 500 });
    }
}