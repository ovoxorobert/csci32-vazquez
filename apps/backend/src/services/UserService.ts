import type { SignUpInput } from '@/resolvers/types/AuthTypes'
import type { FindManyUsersFilters } from '@/resolvers/types/FindManyUsersFilters'
import type { FindManyUsersInput } from '@/resolvers/types/FindManyUsersInput'
import { SortOrder } from '@/resolvers/types/SortOrder'
import { comparePassword, hashPassword, signToken } from '@/utils/auth'
import { PrismaClient, PermissionName, BASIC_ROLE_ID, Prisma } from 'csci32-db'

export interface UserServiceProps {
  prisma: PrismaClient
}

export class UserService {
  prisma: PrismaClient

  constructor({ prisma }: UserServiceProps) {
    this.prisma = prisma
  }
  getOrderBy(params: FindManyUsersInput): Prisma.UserOrderByWithRelationInput {
    const { sortColumn, sortDirection } = params
    if (sortColumn) {
      return { [sortColumn]: sortDirection ?? SortOrder.ASC }
    }
    return { name: SortOrder.ASC }
  }

  getUsersWhereClause(params: FindManyUsersInput): Prisma.UserWhereInput {
    const { filters } = params
    const where: Prisma.UserWhereInput = {}

    if (filters?.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { email: { contains: filters.query, mode: 'insensitive' } },
      ]
    }

    return where
  }

  async findMany(params: FindManyUsersInput) {
    const { skip = 0, take = 15 } = params
    const orderBy = this.getOrderBy(params)
    const where = this.getUsersWhereClause(params)

    return this.prisma.user.findMany({
      skip,
      take,
      orderBy,
      where,
    })
  }

  async getTotalUsers(filters: FindManyUsersFilters) {
    const where = this.getUsersWhereClause({ filters })
    return this.prisma.user.count({ where })
  }

  async createUser(params: SignUpInput) {
    const { email, password, name } = params

    // 1) Enforce unique email
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new Error('Email already in use')
    }

    // 2) Hash password
    const passwordHash = await hashPassword(password)

    // 3) Create user (adjust model/field names to your Prisma schema)
    const created = await this.prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        role: { connect: { role_id: BASIC_ROLE_ID } },
      },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: {
          select: {
            name: true,
            role_permissions: {
              select: { permission: { select: { name: true } } },
            },
          },
        },
      },
    })

    // 4) Sign JWT with standard claims
    const token = signToken({
      sub: created.user_id,
      email: created.email,
      name: created.name ?? undefined,
      role: created.role?.name,
      permissions:
        created.role?.role_permissions.map((p) => p.permission.name) ?? [],
    })

    return { user: created, token }
  }
  async authenticateUser(params: { email: string; password: string }) {
    const { email, password } = params

    // 1) Look up by email (select the hash for verification)
    const found = await this.prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: {
          select: {
            name: true,
            role_permissions: {
              select: { permission: { select: { name: true } } },
            },
          },
        },
      },
    })

    // Prevent user enumeration — use a generic error
    if (!found || !found.passwordHash) {
      throw new Error('Invalid email or password')
    }

    // 2) Compare provided password to stored hash
    const ok = await comparePassword(password, found.passwordHash)
    if (!ok) {
      throw new Error('Invalid email or password')
    }

    // 3) Create a token
    const token = signToken({
      sub: found.user_id,
      email: found.email,
      name: found.name ?? undefined,
      role: found.role?.name,
      permissions:
        found.role?.role_permissions.map((p) => p.permission.name) ?? [],
    })

    // 4) Return safe user shape (omit passwordHash)
    const { passwordHash, ...user } = found as any
    return { user, token }
  }
}
