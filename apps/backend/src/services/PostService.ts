import type { PrismaClient } from 'csci32-db'

export interface ServiceDeps {
  prisma: PrismaClient
}

export type CreatePostInput = {
  title: string
  body: string
  comments?: { body: string }[]
}

export class PostService {
  constructor(private deps: ServiceDeps) {}

  async createForAuthor(input: CreatePostInput, authorUserId: string) {
    const { prisma } = this.deps
    const { title, body, comments } = input

    if (comments?.length) {
      const commentsWithAuthorId = comments.map((comment) => ({
        body: comment.body,
        authorId: authorUserId,
      }))

      return prisma.post.create({
        data: {
          title,
          body,
          authorId: authorUserId,
          comments: { create: commentsWithAuthorId },
        },
        include: { author: true, comments: true },
      })
    }

    return prisma.post.create({
      data: { title, body, authorId: authorUserId },
      include: { author: true },
    })
  }
}
