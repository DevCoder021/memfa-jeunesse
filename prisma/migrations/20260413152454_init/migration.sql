-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activites" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ponctuelle',
    "dateActivite" TIMESTAMP(3),
    "heure" TEXT,
    "lieu" TEXT NOT NULL DEFAULT 'Temple MEMFA',
    "objectif" TEXT,
    "participants" TEXT NOT NULL DEFAULT 'Toute la jeunesse',
    "preparation" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'a_venir',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rappel_logs" (
    "id" SERIAL NOT NULL,
    "activiteId" INTEGER NOT NULL,
    "joursRestants" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'manuel',
    "envoyeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rappel_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "rappel_logs" ADD CONSTRAINT "rappel_logs_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "activites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
