-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('PASANTIA', 'TRAINEE', 'JUNIOR');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "seniority" "Seniority" NOT NULL,
    "workMode" "WorkMode" NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
