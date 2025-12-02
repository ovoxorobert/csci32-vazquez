import { Field, ID, ObjectType, Int } from 'type-graphql'
import { User } from './User'

@ObjectType()
export class Review {
  @Field(() => ID)
  id!: string

  @Field(() => Int)
  rating!: number // 1 to 5 stars

  @Field(() => String, { nullable: true })
  body?: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => User)
  author!: User
}
