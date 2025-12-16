import { InputType, Field, Float, Int } from 'type-graphql'

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => Float)
  price!: number

  @Field(() => Int)
  stock!: number

  @Field(() => String)
  sku!: string
}
