import { ObjectType, Field, ID } from 'type-graphql'
import { Permission } from './Permission'
import { RoleName } from 'csci32-db'

@ObjectType()
export class Role {
  @Field(() => ID)
  role_id!: string

  @Field(() => String)
  name!: RoleName

  @Field(() => [Permission])
  permissions!: Permission[]
}
