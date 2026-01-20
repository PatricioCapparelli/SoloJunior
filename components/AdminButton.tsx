import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default async function AdminButton() {
    const { userId } = await auth();

    // Verificamos contra la variable de entorno (la misma que usás en /admin)
    const isAdmin = userId === process.env.ADMIN_USER_ID;

    // Si no sos admin, este componente no renderiza NADA (ni HTML invisible)
    if (!isAdmin) return null;

    return (
        <Link
            href="/admin"
            className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-700 hover:scale-110 transition-all flex items-center gap-2 group border-4 border-white dark:border-slate-900"
            title="Ir al Panel de Admin"
        >
            <ShieldCheck size={24} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold">
                Panel Admin
            </span>
        </Link>
    );
}