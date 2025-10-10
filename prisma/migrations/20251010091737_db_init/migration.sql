-- CreateTable
CREATE TABLE "LandlordCommunication" (
    "id" SERIAL NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isInitialMessage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandlordCommunication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandlordCommunication_threadId_idx" ON "LandlordCommunication"("threadId");

-- CreateIndex
CREATE INDEX "LandlordCommunication_tenantId_idx" ON "LandlordCommunication"("tenantId");

-- CreateIndex
CREATE INDEX "LandlordCommunication_senderId_idx" ON "LandlordCommunication"("senderId");

-- CreateIndex
CREATE INDEX "LandlordCommunication_recipientId_idx" ON "LandlordCommunication"("recipientId");

-- AddForeignKey
ALTER TABLE "LandlordCommunication" ADD CONSTRAINT "LandlordCommunication_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandlordCommunication" ADD CONSTRAINT "LandlordCommunication_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandlordCommunication" ADD CONSTRAINT "LandlordCommunication_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
