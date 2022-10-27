// * Types
import type User from 'App/Models/User/User'
import type { SignOptions } from 'jsonwebtoken'
// * Types

export type SignTokenConfig = Pick<SignOptions, 'algorithm' | 'expiresIn'> & {
  key: string,
}

export type Tokens = {
  access: string,
  refresh: string,
}

export type UserTokenPayload = {
  id: User['id'],
  email: User['email'],
  roleId: User['roleId'],
  type: User['type'],
}
