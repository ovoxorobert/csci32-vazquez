import { Arg, Ctx, Query, Resolver, ID } from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { Product } from './types/Product'
import { ListProductsInput } from './types/ListProductsInput'

@Resolver()
export class ProductResolver {
  // Query 1: Get a single product by ID
  @Query(() => Product, {
    nullable: true,
    description: 'Find a product by its unique ID.',
  })
  async product(
    @Ctx() ctx: Context,

    @Arg('id', () => ID) id: string,
  ): Promise<Product | null> {
    return ctx.productService.findById(id)
  }

  @Query(() => [Product], {
    description: 'List products with optional sorting and pagination.',
  })
  async products(
    @Ctx() ctx: Context,

    @Arg('input', () => ListProductsInput, { nullable: true })
    input: ListProductsInput,
  ): Promise<Product[]> {
    return ctx.productService.findMany(input || {})
  }
}
