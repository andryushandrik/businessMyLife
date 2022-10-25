// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { AuthHeaders } from 'Contracts/auth'
import type { SignTokenConfig } from 'Contracts/token'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import Session from 'App/Models/User/Session'
import { sign, verify } from 'jsonwebtoken'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class TokenService {
  public static async createUserTokenSession(userId: User['id'], token: string, headers: AuthHeaders): Promise<void> {
    try {
      await Session.create({ userId, token, ...headers })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async getUserTokenSession(token: string): Promise<Session> {
    let tokenSession: Session | null

    try {
      tokenSession = await Session.findBy('token', token)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!tokenSession)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.TOKEN_ERROR } as Err

    return tokenSession
  }

  public static async updateUserTokenSession(oldToken: Session['token'], newToken: string, headers?: AuthHeaders): Promise<void> {
    let tokenSession: Session

    try {
      tokenSession = await this.getUserTokenSession(oldToken)
    } catch (err: Err | any) {
      throw err
    }

    if (headers) { // * Safety update
      if (
        headers.fingerprint != tokenSession.fingerprint ||
        headers.userAgent != tokenSession.userAgent
      ) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.MISS_AUTH_HEADERS } as Err
    }

    try {
      await tokenSession.merge({ token: newToken }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async deleteUserTokenSession(token: Session['token'], headers?: AuthHeaders): Promise<void> {
    let tokenSession: Session

    try {
      tokenSession = await this.getUserTokenSession(token)
    } catch (err: Err | any) {
      throw err
    }

    if (headers) { // * Safety delete
      if (
        headers.fingerprint != tokenSession.fingerprint ||
        headers.userAgent != tokenSession.userAgent
      ) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.MISS_AUTH_HEADERS } as Err
    }

    try {
      await tokenSession.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * JWT
   */

  public static createToken(payload: any, config: SignTokenConfig): string {
    if (!config.algorithm)
      config.algorithm = 'HS512'

    return sign(payload, config.key, { algorithm: config.algorithm, expiresIn: config.expiresIn })
  }

  public static verifyToken<D = any>(token: string, key: string): D {
    try { // @ts-ignore
      return verify(token, key) as D
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.TOKEN_ERROR } as Err
    }
  }
}
