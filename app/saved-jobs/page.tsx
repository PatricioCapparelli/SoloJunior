import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import JobListItem from "@/components/JobListItem";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mis Guardados | SoloJunior",
};

export default async function SavedJobsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/"); 
    }

    const savedJobs = await prisma.savedJob.findMany({
        where: {
            userId,
        },
        include: {
            job: true,
        },
        orderBy: {
            createdAt: "desc", 
        },
    });

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Mis Empleos Guardados ❤️</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Acá tenés la lista de ofertas que te interesaron. ¡No cuelgues en postularte!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {savedJobs.length > 0 ? (
                    savedJobs.map(({ job }) => (
                        <JobListItem key={job.id} job={job} isSaved={true} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="text-lg mb-2">Todavía no guardaste nada 💔</p>
                        <p className="text-sm">Explorá el inicio y dale al corazón en las ofertas que te gusten.</p>
                    </div>
                )}
            </div>
        </main>
    );
}