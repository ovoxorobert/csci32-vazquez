import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { PostService } from '@/services/PostService'
import { UserService } from '@/services/UserService'

import { PRISMA_FASTIFY_PLUGIN_NAME } from './prisma'

declare module 'fastify' {
  interface FastifyInstance {
    postService: PostService
    userService: UserService
  }
}

export default fp(
  async function servicesPlugin(fastify: FastifyInstance) {
    if (!fastify.prisma) {
      throw new Error(
        'Prisma client not found on fastify instance. Check 01-prisma.ts',
      )
    }

    const postService = new PostService({ prisma: fastify.prisma })
    fastify.decorate('postService', postService)

    const userService = new UserService({ prisma: fastify.prisma })
    fastify.decorate('userService', userService)

    fastify.log.info(
      'Application services initialized (postService, userService).',
    )
  },
  {
    name: 'app-services',
    dependencies: [PRISMA_FASTIFY_PLUGIN_NAME],
  },
)
