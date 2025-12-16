export * from './seeders/seedRoles.js'
export * from './seeders/seedPermissions.js'
export * from './seeders/seedUsers.js'
import { PrismaClient, PermissionName } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { PermissionName }
export * from '@prisma/client'
