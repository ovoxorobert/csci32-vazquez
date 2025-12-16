export * from '../prisma/seeders/seedRoles.js';
export * from '../prisma/seeders/seedPermissions.js';
export * from '../prisma/seeders/seedUsers.js';
import { PrismaClient, PermissionName } from '@prisma/client';
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { PermissionName };
export * from '@prisma/client';
//# sourceMappingURL=client.d.ts.map