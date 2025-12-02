import { PrismaClient } from 'csci32-db'
import { ListProductsInput } from '@/resolvers/types/ListProductsInput'
import { Product } from '@/resolvers/types/Product'
import { SortDirection } from '@/resolvers/types/SortDirection'
import { ProductSortField } from '@/resolvers/types/ProductSortField'

// Define the dependencies interface
interface ProductServiceDeps {
  prisma: PrismaClient
}

export class ProductService {
  private deps: ProductServiceDeps

  constructor(deps: ProductServiceDeps) {
    this.deps = deps
  } // 1. findOne query implementation (find by ID)

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

  async findMany(input: ListProductsInput): Promise<Product[]> {
    const { prisma } = this.deps

    const skip = input.skip ?? 0
    const take = input.take ?? 10
    const sortBy = input.sortBy ?? ProductSortField.CREATED_AT
    const sortDirection = input.sortDirection ?? SortDirection.DESC

    const orderBy = {
      [sortBy]: sortDirection.toLowerCase(),
    }

    return prisma.product.findMany({
      skip,
      take,
      orderBy,
      include: {
        reviews: true,
      },
    }) as unknown as Product[]
  }
}
