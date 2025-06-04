-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_sessionId_key" ON "Ticket"("sessionId");
