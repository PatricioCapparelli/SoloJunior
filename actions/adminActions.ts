"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server"; 
import { revalidatePath } from "next/cache";
import { Resend } from "resend"; 
import { JobApprovedEmail } from "@/components/emails/JobApprovedEmail"; 

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const newStatus = !currentStatus;
  const job = await prisma.job.update({
    where: { id: jobId },
    data: { approved: newStatus },
  });

  // 2. Si estamos APROBANDO (newStatus es true), mandamos el mail 📧
  if (newStatus === true) {
    try {
      const client = await clerkClient();
      const jobOwner = await client.users.getUser(job.userId);
      
      const ownerEmail = jobOwner.emailAddresses[0]?.emailAddress;
      const ownerName = jobOwner.firstName || "Colega";

      if (ownerEmail) {
        await resend.emails.send({
          from: 'SoloJunior <onboarding@resend.dev>',
          to: ownerEmail, 
          subject: '¡Tu oferta está online! 🟢',
          react: JobApprovedEmail({
            jobTitle: job.title,
            companyName: job.company,
            userName: ownerName,
            jobId: job.id
          })
        });
        console.log("✅ Mail de aprobación enviado a:", ownerEmail);
      }
    } catch (error) {
      console.error("❌ No se pudo enviar el mail de aprobación:", error);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
}