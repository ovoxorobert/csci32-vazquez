import fp from 'fastify-plugin'
import { PrismaClient } from 'csci32-db'
import type { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export const PRISMA_FASTIFY_PLUGIN_NAME = 'prisma'

export default fp(
  async function prismaPlugin(fastify: FastifyInstance) {
    const prisma = new PrismaClient()

    await prisma.$connect()
    fastify.addHook('onClose', async () => {
      await prisma.$disconnect()
    })

    fastify.decorate(PRISMA_FASTIFY_PLUGIN_NAME, prisma)
    fastify.log.info('Prisma Client initialized and connected.')
  },
  { name: PRISMA_FASTIFY_PLUGIN_NAME },
)
