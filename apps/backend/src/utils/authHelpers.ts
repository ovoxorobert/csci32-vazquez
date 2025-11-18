import type { Context } from '@/utils/graphql'
import jwt from 'jsonwebtoken'
import type { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken'
import type { PermissionName } from 'csci32-db'
import { getRequiredStringEnvVar } from '@/utils'

interface JwtPayload extends DefaultJwtPayload {
  sub: string
  email?: string
  role?: string
  permissions?: PermissionName[]
}

export function getDecodedPayload(ctx: Context): JwtPayload {
  const authHeader = ctx.request?.headers?.authorization as string | undefined
  if (!authHeader) throw new Error('Unauthorized')

  const token = authHeader.replace('Bearer ', '')
  const decoded = jwt.verify(token, getRequiredStringEnvVar('PRIVATE_KEY'), {
    algorithms: [(process.env.ALGORITHM ?? 'ES256') as jwt.Algorithm],
  })

  return decoded as JwtPayload
}

export function getUserIdFromJwt(ctx: Context): string {
  const payload = getDecodedPayload(ctx)
  if (!payload.sub) {
    throw new Error('Unauthorized: No user ID in token payload.')
  }
  return payload.sub
}
