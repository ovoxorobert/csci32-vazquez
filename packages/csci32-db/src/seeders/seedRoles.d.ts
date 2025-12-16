import { PrismaClient } from '@prisma/client';
export declare const ADMIN_ROLE_ID = "role-admin";
export declare const BASIC_ROLE_ID = "role-basic";
export declare function seedRoles(prisma: PrismaClient): Promise<{
    adminRole: {
        role_id: string;
        name: import("@prisma/client").$Enums.RoleName;
    };
    basicRole: {
        role_id: string;
        name: import("@prisma/client").$Enums.RoleName;
    };
}>;
//# sourceMappingURL=seedRoles.d.ts.map