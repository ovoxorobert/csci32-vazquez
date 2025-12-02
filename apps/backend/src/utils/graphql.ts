import { UserResolver } from '@/resolvers/UserResolver'
import { RoleResolver } from '@/resolvers/RoleResolver'
import { PostResolver } from '@/resolvers/PostResolver'
import { ProductResolver } from '@/resolvers/ProductResolver'
import { buildSchema, registerEnumType } from 'type-graphql'
import { customAuthChecker } from '@/utils/authChecker'
import { PermissionName, RoleName } from 'csci32-db'
import type { NonEmptyArray } from 'type-graphql'
import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { PrismaClient } from 'csci32-db'
import { getBooleanEnvVar, getRequiredStringEnvVar } from '@/utils'
import type { UserService } from '@/services/UserService'
import type { ProductService } from '@/services/ProductService'
import type { PostService } from '@/services/PostService'
import mercurius from 'mercurius'
import mercuriusLogging from 'mercurius-logging'

const GRAPHQL_API_PATH = '/api/graphql'
const GRAPHQL_DEPTH_LIMIT = 7

export interface ServiceContainer {
  userService: UserService
  postService: PostService
  productService: ProductService
  prisma: PrismaClient
}

declare module 'fastify' {
  interface FastifyInstance extends ServiceContainer {}
}

registerEnumType(PermissionName, {
  name: 'PermissionName',
  description: 'Enum representing valid permissions for authorization',
})

registerEnumType(RoleName, {
  name: 'RoleName',
  description: 'Enum representing valid roles for users',
})

const resolvers = [
  UserResolver,
  RoleResolver,
  PostResolver,
  ProductResolver,
] as NonEmptyArray<Function>

export interface Context {
  request: FastifyRequest
  reply: FastifyReply
  userService: UserService
  postService: PostService
  productService: ProductService
  prisma: PrismaClient
  log: FastifyBaseLogger
}

export async function registerGraphQL(fastify: FastifyInstance) {
  const schema = await buildSchema({
    resolvers,
    authChecker: customAuthChecker,
  })

  const graphiql = getBooleanEnvVar('ENABLE_GRAPHIQL', false)
  fastify.log.info(`GraphiQL is ${graphiql ? 'enabled' : 'disabled'}`)

  const options = {
    schema,
    cache: false,
    path: GRAPHQL_API_PATH,
    graphiql,
    queryDepth: GRAPHQL_DEPTH_LIMIT,

    context: (request: FastifyRequest, reply: FastifyReply): Context => ({
      request,
      reply,

      userService: fastify.userService,
      postService: fastify.postService,
      productService: fastify.productService,
      prisma: fastify.prisma,
      log: fastify.log,
    }),
    allowBatchedQueries: false,
  }

  await fastify.register(mercurius, options)
  await fastify.register(mercuriusLogging, {
    prependAlias: true,
    logBody: true,
    logVariables: getRequiredStringEnvVar('NODE_ENV') === 'development',
  })
}
