import { PrismaClient } from '@prisma/client'
import { seedPermissions } from './seeders/seedPermissions'
import { seedRoles } from './seeders/seedRoles'
import { seedUsers } from './seeders/seedUsers'

const prisma = new PrismaClient()

// Function to handle the new post/comment seeding logic
async function seedPostsAndComments(prisma: PrismaClient) {
  console.log('📝 Starting Post and Comment seed...')

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

  // 2. Seed users (needed for Post authorship)
  await seedUsers(prisma, adminRole.role_id, basicRole.role_id)

  // 3. Seed new Post and Comment data
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
