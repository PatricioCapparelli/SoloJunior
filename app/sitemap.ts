import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. URL base (igual que en robots.ts)
    const baseUrl = "https://solo-junior.vercel.app";

    // 2. Obtener todas las ofertas APROBADAS de la base de datos
    const jobs = await prisma.job.findMany({
        where: { approved: true },
        select: { id: true, createdAt: true }, // Solo necesitamos ID y fecha
    });

    const jobUrls = jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.id}`,
        lastModified: job.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    // 4. URLs estáticas (Home, Publicar, etc)
    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const, // El home cambia seguido
            priority: 1, // Prioridad máxima
        },
        {
            url: `${baseUrl}/jobs/new`,
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.5,
        },
    ];

    // 5. Unir todo y devolver
    return [...staticUrls, ...jobUrls];
}