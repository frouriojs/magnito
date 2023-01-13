import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export const getPrismaClient = () => {
  prisma = prisma ?? new PrismaClient()
  return prisma
}
