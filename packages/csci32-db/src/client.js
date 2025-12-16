export * from '../prisma/seeders/seedRoles.js';
export * from '../prisma/seeders/seedPermissions.js';
export * from '../prisma/seeders/seedUsers.js';
import { PrismaClient, PermissionName } from '@prisma/client';
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
export { PermissionName };
export * from '@prisma/client';
//# sourceMappingURL=client.js.map