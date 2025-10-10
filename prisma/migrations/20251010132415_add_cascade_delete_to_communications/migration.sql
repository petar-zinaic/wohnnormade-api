-- DropForeignKey
ALTER TABLE "LandlordCommunication" DROP CONSTRAINT "LandlordCommunication_senderId_fkey";

-- DropForeignKey
ALTER TABLE "LandlordCommunication" DROP CONSTRAINT "LandlordCommunication_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "LandlordCommunication" DROP CONSTRAINT "LandlordCommunication_tenantId_fkey";

-- AddForeignKey
ALTER TABLE "LandlordCommunication" ADD CONSTRAINT "LandlordCommunication_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandlordCommunication" ADD CONSTRAINT "LandlordCommunication_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandlordCommunication" ADD CONSTRAINT "LandlordCommunication_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

