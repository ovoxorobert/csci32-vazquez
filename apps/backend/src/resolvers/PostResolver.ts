import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { CreatePostInput } from '@/resolvers/types/CreatePostInput'
import { getUserIdFromJwt } from '@/utils/authHelpers'

@Resolver()
export class PostResolver {
  @Query(() => String)
  helloPostWorld(): string {
    return 'Post resolver is active and schema is loading!'
  }

  @Mutation(() => String)
  async createPost(
    @Ctx() ctx: Context,
    @Arg('input', () => CreatePostInput) input: CreatePostInput,
  ): Promise<string> {
    const authorUserId = getUserIdFromJwt(ctx)
    const post = await ctx.postService.createForAuthor(input, authorUserId)
    return post.id
  }
}
