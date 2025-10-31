// apps/backend/src/resolvers/types/User.ts

import { ObjectType, Field, ID } from 'type-graphql'
import { Role } from './Role' // You need this import if you define the role field here.

@ObjectType()
export class User {
  @Field(() => ID)
  user_id!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string // This field is needed by the new FieldResolver to connect to the Role object

  role_id?: string

  // This field is needed if you want to query the Role directly from the User
  @Field(() => Role, { nullable: true })
  role?: Role
}
