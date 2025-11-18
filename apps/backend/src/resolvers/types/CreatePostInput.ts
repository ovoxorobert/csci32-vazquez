import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateCommentForPostInput {
  @Field(() => String)
  body!: string
}

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title!: string

  @Field(() => String)
  body!: string

  @Field(() => [CreateCommentForPostInput], { nullable: true })
  comments?: CreateCommentForPostInput[]
}
