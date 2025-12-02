import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'
import { Review } from './Review'

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => Number)
  price!: number

  @Field(() => Number)
  stock!: number

  @Field(() => String)
  sku!: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date

  @Field(() => [Review], { nullable: true })
  reviews?: Review[]
}
