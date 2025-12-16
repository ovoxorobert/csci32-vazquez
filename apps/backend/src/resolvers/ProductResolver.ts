import { Arg, Ctx, Query, Resolver, ID, Mutation } from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { Product } from './types/Product'
import { ListProductsInput } from './types/ListProductsInput'
import { CreateProductInput } from './types/CreateProductInput'

@Resolver()
export class ProductResolver {
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

  // New mutation
  @Mutation(() => Product, {
    description: 'Creates a new product in the catalog (Admin required).',
  })
  async createProduct(
    @Ctx() ctx: Context,
    @Arg('input', () => CreateProductInput) input: CreateProductInput,
  ): Promise<Product> {
    return ctx.productService.create(input)
  }
}
