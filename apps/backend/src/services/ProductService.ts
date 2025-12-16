import { PrismaClient } from 'csci32-db'
import { ListProductsInput } from '@/resolvers/types/ListProductsInput'
import { Product } from '@/resolvers/types/Product'
import { SortDirection } from '@/resolvers/types/SortDirection'
import { ProductSortField } from '@/resolvers/types/ProductSortField'
import { CreateProductInput } from '../resolvers/types/CreateProductInput'

interface ProductServiceDeps {
  prisma: PrismaClient
}

export class ProductService {
  private deps: ProductServiceDeps

  constructor(deps: ProductServiceDeps) {
    this.deps = deps
  }

  //findOne query implementation (find by ID)
  async findById(id: string): Promise<Product | null> {
    return this.deps.prisma.product.findUnique({
      where: { id },
      include: {
        // Include related reviews when fetching a single product
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    }) as unknown as Product | null
  }

  //findMany query implementation (list products)
  async findMany(input: ListProductsInput): Promise<Product[]> {
    const { prisma } = this.deps

    const skip = input.skip ?? 0
    const take = input.take ?? 10
    const sortBy = input.sortBy ?? ProductSortField.CREATED_AT
    const sortDirection = input.sortDirection ?? SortDirection.DESC

    const orderBy = {
      [sortBy]: sortDirection.toLowerCase(),
    }

    // Add search filter
    const where = input.search
      ? {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            {
              description: {
                contains: input.search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {}

    return prisma.product.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        reviews: true,
      },
    }) as unknown as Product[]
  }

  //create mutation implementation (create product)
  async create(input: CreateProductInput): Promise<Product> {
    const { prisma } = this.deps

    const sku = `PROD-${Date.now()}`

    const newProduct = await prisma.product.create({
      data: {
        ...input,
        sku: sku,
      },
      include: {
        reviews: true,
      },
    })
    return newProduct as unknown as Product
  }
}
