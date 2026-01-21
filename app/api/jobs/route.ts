import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import { auth, currentUser } from '@clerk/nextjs/server'; // ✅ Agregamos currentUser
import { ratelimit } from "@/lib/ratelimit";
import { Resend } from 'resend'; // ✅ Importamos Resend
import { JobPostedEmail } from "@/components/emails/JobPostedEmail"; // ✅ Importamos tu diseño

// 1. Inicializamos Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Esquema de validación estricto
const createJobSchema = z.object({
    title: z.string().min(3, "El título es muy corto"),
    description: z.string().min(10, "La descripción es muy corta"),
    seniority: z.enum(['PASANTIA', 'TRAINEE', 'JUNIOR']),
    workMode: z.enum(['REMOTO', 'HIBRIDO', 'PRESENCIAL']),
    company: z.string().min(2),
    url: z.string().url("Debe ser una URL válida"),
    imageUrl: z.string().optional(),
});

// Crear un nuevo trabajo (POST)
export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser(); // ✅ Obtenemos los datos del usuario (Email y Nombre)

        if (!userId || !user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // --- 🛡️ RATE LIMIT (Upstash) ---
        const { success } = await ratelimit.limit(userId);
        if (!success) {
            return new NextResponse("Demasiados intentos. Esperá un rato antes de volver a publicar.", { status: 429 });
        }
        // -------------------------------

        const body = await request.json();
        const validation = createJobSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: validation.error.format() },
                { status: 400 }
            );
        }

        // 2. Guardar en PostgreSQL
        const newJob = await prisma.job.create({
            data: {
                title: validation.data.title,
                description: validation.data.description,
                seniority: validation.data.seniority,
                workMode: validation.data.workMode,
                company: validation.data.company,
                url: validation.data.url,
                userId: userId,
                imageUrl: validation.data.imageUrl,
                approved: false,
            },
        });

        // 3. 📧 ENVIAR EL EMAIL CON RESEND
        // Sacamos el email y nombre real del usuario de Clerk
        const userEmail = user.emailAddresses[0].emailAddress;
        const userName = user.firstName || "Dev";

        try {
            await resend.emails.send({
                // Usamos el dominio de prueba de Resend (funciona siempre)
                from: 'SoloJunior <onboarding@resend.dev>',
                
                // ⚠️ IMPORTANTE: En modo gratuito (Sandbox), esto SOLO envía si 'userEmail'
                // es el mismo email con el que te registraste en Resend.
                to: userEmail,
                
                subject: '¡Recibimos tu oferta! 🚀',
                react: JobPostedEmail({ 
                    jobTitle: newJob.title, 
                    companyName: newJob.company, 
                    userName: userName,
                    jobId: newJob.id 
                }),
            });
            console.log(`📧 Email enviado exitosamente a ${userEmail}`);
        } catch (emailError) {
            console.error("❌ Error enviando email con Resend:", emailError);
        }

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
            where: {
                approved: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener trabajos" }, { status: 500 });
    }
}