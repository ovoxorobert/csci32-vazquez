import { Field, InputType } from 'type-graphql'
export { UserDTO, AuthPayload } from './CommonAuthTypes'

@InputType()
export class SignInInput {
  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string
}
