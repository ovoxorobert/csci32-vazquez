import { PermissionName } from '@prisma/client';
export async function seedPermissions(prisma) {
    const permissions = Object.values(PermissionName).map((name) => ({ name }));
    const result = await prisma.permission.createMany({
        data: permissions,
        skipDuplicates: true,
    });
    console.log(`✅ Seeded permissions: ${result.count}`);
}
//# sourceMappingURL=seedPermissions.js.map