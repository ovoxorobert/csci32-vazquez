// apps/backend/src/resolvers/UserResolver.ts

import 'reflect-metadata'
import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Mutation,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { AuthPayload, SignUpInput } from './types/AuthTypes'
import { SignInInput } from './types/SignInTypes'
import { PermissionName } from 'csci32-db'
import { FindManyUsersInput } from './types/FindManyUsersInput'
import { Role } from './types/Role'
import { User } from './types/User'

@Resolver(() => User)
export class UserResolver {
  @Authorized([PermissionName.UserRead])
  @Query(() => [User])
  findManyUsers(
    @Ctx() { userService }: Context,
    @Arg('params', () => FindManyUsersInput, { nullable: true })
    params?: FindManyUsersInput,
  ) {
    return userService.findMany(params ?? {})
  }

  @Authorized([PermissionName.UserRead])
  @Query(() => Number)
  totalUsers(
    @Ctx() { userService }: Context,
    @Arg('params', () => FindManyUsersInput, { nullable: true })
    params?: FindManyUsersInput,
  ) {
    return userService.getTotalUsers(params?.filters ?? {})
  }

  @Mutation(() => AuthPayload)
  async signUp(
    @Arg('input', () => SignUpInput) input: SignUpInput,
    @Ctx() { userService }: Context,
  ): Promise<AuthPayload> {
    if (!input.email || !input.password) {
      throw new Error('email and password are required')
    }
    const { user, token } = await userService.createUser(input)
    return { user, token }
  }

  @Mutation(() => AuthPayload)
  async signIn(
    @Arg('input', () => SignInInput) input: SignInInput,
    @Ctx() { userService }: Context,
  ): Promise<AuthPayload> {
    if (!input.email || !input.password) {
      throw new Error('email and password are required')
    }
    const { user, token } = await userService.authenticateUser(input)
    return { user, token }
  } // === Field Resolver for Role ===

  @FieldResolver(() => Role, { nullable: true })
  async role(@Root() user: User, @Ctx() ctx: Context) {
    if (!user.role_id) {
      return null
    }

    return ctx.prisma.role.findUnique({
      where: { role_id: user.role_id },
    })
  }
}
