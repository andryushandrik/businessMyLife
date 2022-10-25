// * Types
import type { AuthConfig } from 'Contracts/auth'
import type { CookieOptions } from '@ioc:Adonis/Core/Response'
// * Types

import Env from '@ioc:Adonis/Core/Env'

export const COOKIE_REFRESH_TOKEN_KEY: string = 'refreshToken'

const authConfig: AuthConfig = {
  userVerifyExpire: Env.get('USER_VERIFY_TOKEN_EXPIRE'),
  access: {
    key: Env.get('ACCESS_TOKEN_KEY'),
    expire: Env.get('ACCESS_TOKEN_EXPIRE'),
  },
  refresh: {
    key: Env.get('REFRESH_TOKEN_KEY'),
    expire: Env.get('REFRESH_TOKEN_EXPIRE'),
  },
}

export const COOKIE_REFRESH_TOKEN_CONFIG: Partial<CookieOptions> = {
  httpOnly: true,
  maxAge: authConfig.refresh.expire,
  path: '/api/auth',
}

export default authConfig
