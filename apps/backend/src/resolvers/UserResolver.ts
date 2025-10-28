import 'reflect-metadata'
import {
  Resolver,
  Query,
  Field,
  ObjectType,
  Ctx,
  ID,
  Arg,
  Mutation,
  Authorized,
} from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { AuthPayload, SignUpInput } from './types/AuthTypes'
import { SignInInput } from './types/SignInTypes'
import { PermissionName } from 'csci32-db/permissions'
import { FindManyUsersInput } from './types/FindManyUsersInput'

@ObjectType()
class User {
  @Field(() => ID)
  user_id!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string
}

@Resolver()
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
  }
}
