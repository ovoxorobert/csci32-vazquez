import { Field, ObjectType, ID } from 'type-graphql'
import { RoleName } from 'csci32-db'

@ObjectType()
export class UserDTO {
  @Field(() => ID)
  user_id!: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => RoleName, { nullable: true })
  role?: RoleName | null
}

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string

  @Field(() => UserDTO)
  user!: UserDTO
}
