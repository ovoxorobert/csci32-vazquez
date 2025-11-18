import { RoleName } from 'csci32-db'
import { ObjectType, Field, ID } from 'type-graphql'
import { Permission } from './Permission'

@ObjectType()
export class Role {
  @Field(() => ID)
  role_id!: string

  @Field(() => RoleName)
  name!: RoleName

  @Field(() => [Permission])
  permissions!: Permission[]
}
