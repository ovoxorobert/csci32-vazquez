import { Field, InputType } from 'type-graphql'

export { UserDTO, AuthPayload } from './CommonAuthTypes'

@InputType()
export class SignUpInput {
  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string

  @Field(() => String, { nullable: true })
  name?: string
}
