import { PrismaClient } from '@prisma/client'
import { seedPermissions } from './seeders/seedPermissions'
import { seedRoles } from './seeders/seedRoles'
import { seedUsers } from './seeders/seedUsers'

const prisma = new PrismaClient()

// Function to handle the new Product seeding logic
async function seedProducts(prisma: PrismaClient) {
  console.log('🛍️ Starting Product seed...')

  await prisma.product.deleteMany()

  // === Seeding Products ===
  await prisma.product.createMany({
    data: [
      {
        name: 'Labubu',
        description:
          '3D printed Labubu figure fits inside all standard PC cases.',
        price: 199.99,
        stock: 50,
        sku: 'QTL-001',
      },
      {
        name: 'SSD Holder',
        description: '3D printer SSD Holder out of sight!',
        price: 29.5,
        stock: 500,
        sku: 'QTL-002',
      },
      {
        name: 'PCI Slot',
        description: '#D printer PCI slot to hold HDMI',
        price: 15.0,
        stock: 120,
        sku: 'QTL-003',
      },
      {
        name: 'LCD Holder',
        description: '3D Printed mini 11" LCD screen holder',
        price: 499.0,
        stock: 15,
        sku: 'QTL-004',
      },
      {
        name: 'Motherboard Hider',
        description: '3D printed Motherboard layover hides all cables',
        price: 45.99,
        stock: 80,
        sku: 'QTL-005',
      },
    ],
  })

  console.log('✅ Product seed completed. 5 products created.')
}

// Function to handle the Post/Comment seeding logic
async function seedPostsAndComments(prisma: PrismaClient) {
  console.log('📝 Starting Post and Comment seed...')

  // Clear existing content (children -> parents)
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()

  // Find an existing user to be the author
  const author = await prisma.user.findFirst({ select: { user_id: true } })

  if (!author) {
    console.warn(
      '⚠️ No users found. Skipping Post seed (needs at least one user to own posts).',
    )
    return
  }

  // === Seeding Posts and Comments ===

  const post1 = await prisma.post.create({
    data: {
      title: 'Hello World',
      body: 'This is the first seeded post.',
      authorId: author.user_id,
    },
  })

  await prisma.comment.createMany({
    data: [
      { body: 'Great post!', postId: post1.id, authorId: author.user_id },
      {
        body: 'Thanks for sharing',
        postId: post1.id,
        authorId: author.user_id,
      },
    ],
  })

  await prisma.post.create({
    data: {
      title: 'Nested Example',
      body: 'Post created with nested comments.',
      authorId: author.user_id,
      comments: {
        create: [
          { body: 'Nice!', authorId: author.user_id },
          { body: 'Following.', authorId: author.user_id },
        ],
      },
    },
  })

  console.log('✅ Post and Comment seed completed.')
}

async function main() {
  console.log('🌱 Starting full database seed...')

  // 1. Seed core authorization data
  await seedPermissions(prisma)
  const { adminRole, basicRole } = await seedRoles(prisma)

  // 2. Seed users (needed for Post and Product authorship later)
  await seedUsers(prisma, adminRole.role_id, basicRole.role_id)

  // 3. Seed new Product data
  await seedProducts(prisma)

  // 4. Seed old Post and Comment data
  await seedPostsAndComments(prisma)

  console.log('✅ All seeds completed successfully!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
