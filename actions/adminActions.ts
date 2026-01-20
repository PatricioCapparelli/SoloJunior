"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Verificar si es admin
async function checkAdmin() {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    throw new Error("No autorizado");
  }
}

export async function deleteReport(reportId: string) {
  await checkAdmin();
  await prisma.report.delete({ where: { id: reportId } });
  revalidatePath("/admin");
}

export async function deleteJobAndReport(jobId: string) {
  await checkAdmin();
  await prisma.job.delete({ where: { id: jobId } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleJobApproval(jobId: string, currentStatus: boolean) {
  await checkAdmin(); 

  await prisma.job.update({
    where: { id: jobId },
    data: { approved: !currentStatus },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}