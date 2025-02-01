-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'PROFESSIONAL', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'USER',
    "userName" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "authenticated" BOOLEAN NOT NULL DEFAULT false,
    "walletId" TEXT,
    "mobile_number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletId_key" ON "User"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_number_key" ON "User"("mobile_number");

-- CreateIndex
CREATE INDEX "User_mobile_number_idx" ON "User"("mobile_number");

-- CreateIndex
CREATE INDEX "OTP_mobile_number_idx" ON "OTP"("mobile_number");
