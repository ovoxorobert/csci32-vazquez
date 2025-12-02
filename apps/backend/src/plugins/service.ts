import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { PostService } from '@/services/PostService'
import { UserService } from '@/services/UserService'
// 1. CRITICAL IMPORT: Import the ProductService
import { ProductService } from '@/services/ProductService'

import { PRISMA_FASTIFY_PLUGIN_NAME } from './prisma'

// 2. CRITICAL DECLARATION: Add productService to the FastifyInstance type
declare module 'fastify' {
  interface FastifyInstance {
    postService: PostService
    userService: UserService
    productService: ProductService // <-- ADDED
  }
}

export default fp(
  async function servicesPlugin(fastify: FastifyInstance) {
    if (!fastify.prisma) {
      throw new Error(
        'Prisma client not found on fastify instance. Check 01-prisma.ts',
      )
    }

    // Instantiation and Decoration for PostService (Existing)
    const postService = new PostService({ prisma: fastify.prisma })
    fastify.decorate('postService', postService)

    // Instantiation and Decoration for UserService (Existing)
    const userService = new UserService({ prisma: fastify.prisma })
    fastify.decorate('userService', userService)

    // 3. CRITICAL INSTANTIATION & DECORATION: Add ProductService
    const productService = new ProductService({ prisma: fastify.prisma })
    fastify.decorate('productService', productService) // <-- ADDED

    fastify.log.info(
      'Application services initialized (postService, userService, productService).', // <-- Updated log
    )
  },
  {
    name: 'app-services',
    dependencies: [PRISMA_FASTIFY_PLUGIN_NAME],
  },
)
