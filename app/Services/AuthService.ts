// * Types
import type User from 'App/Models/User/User'
import type LoginValidator from 'App/Validators/Auth/LoginValidator'
import type ApiLoginValidator from 'App/Validators/Auth/ApiLoginValidator'
import type RegisterValidator from 'App/Validators/Auth/Register/RegisterValidator'
import type CodeVerifyValidator from 'App/Validators/Auth/Register/CodeVerifyValidator'
import type EmailVerifyValidator from 'App/Validators/Auth/Register/EmailVerifyValidator'
import type ForgotPasswordValidator from 'App/Validators/Auth/ForgotPassword/ForgotPasswordValidator'
import type { Err } from 'Contracts/response'
import type { AuthHeaders } from 'Contracts/auth'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import type { SignTokenConfig, Tokens, UserTokenPayload } from 'Contracts/token'
// * Types

import authConfig from 'Config/auth'
import Hash from '@ioc:Adonis/Core/Hash'
import RedisService from './RedisService'
import TokenService from './TokenService'
import MailerService from './MailerService'
import UserService from './User/UserService'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'
import { RoleNames } from 'Config/user'
import { RedisKeys } from 'Config/redis'
import { getRandom } from 'Helpers/index'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type LoginViaAPIReturnData = {
  user: User,
  tokens: Tokens,
}

export default class AuthService {
  public static async loginViaAPI(payload: ApiLoginValidator['schema']['props'], headers: AuthHeaders): Promise<LoginViaAPIReturnData> {
    let user: User

    try {
      let checkIsBlockedUser: boolean = false
      user = await UserService.get(payload.email)

      if (user.blockedUntil)
        checkIsBlockedUser = DateTime.now().toMillis() <= user.blockedUntil.toMillis()

      if (
        !(await Hash.verify(user.password, payload.password)) ||
        checkIsBlockedUser
      ) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Err
    } catch (err: Err | any) {
      throw err
    }

    try {
      const tokens: Tokens = this.createTokens(user)

      await TokenService.createUserTokenSession(user.id, tokens.refresh, headers)

      return { user, tokens }
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async logoutViaAPI(token: string, headers: AuthHeaders): Promise<void> {
    try {
      TokenService.verifyToken(token, authConfig.refresh.key)

      await TokenService.deleteUserTokenSession(token, headers)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async refreshToken(token: string, headers: AuthHeaders): Promise<LoginViaAPIReturnData> {
    let user: User
    let tokenData: UserTokenPayload

    try {
      tokenData = TokenService.verifyToken(token, authConfig.refresh.key)
      user = await UserService.get(tokenData.id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const tokens: Tokens = this.createTokens(user)

      await TokenService.updateUserTokenSession(token, tokens.refresh, headers)

      return { user, tokens }
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async emailVerify({ email }: EmailVerifyValidator['schema']['props'], isForForgotPassword: boolean = false): Promise<void> {
    const code: number = getRandom(100000, 999999) // Only 6-digit code
    const redisKey: RedisKeys = isForForgotPassword ? RedisKeys.FORGOT_PASSWORD_USER_VERIFY : RedisKeys.EMAIL_VERIFY

    try {
      await RedisService.set(redisKey, email, code, { expiration: authConfig.userVerifyExpire, safety: true })

      if (isForForgotPassword)
        await MailerService.sendForgotPasswordVerificationCode(email, code)
      else
        await MailerService.sendRegisterVerificationCode(email, code)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async codeVerify(payload: CodeVerifyValidator['schema']['props'], isForForgotPassword: boolean = false): Promise<void> {
    const redisKey: RedisKeys = isForForgotPassword ? RedisKeys.FORGOT_PASSWORD_USER_VERIFY : RedisKeys.EMAIL_VERIFY

    try {
      const candidateCode: string = await RedisService.get(redisKey, payload.email)

      if (Number(candidateCode) != payload.verifyCode)
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.CODE_VERIFICATION_NOT_FOUND } as Err
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async forgotPassword(payload: ForgotPasswordValidator['schema']['props']): Promise<User> {
    try {
      await this.codeVerify(payload, true)

      await RedisService.remove(RedisKeys.FORGOT_PASSWORD_USER_VERIFY, payload.email)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const user: User = await UserService.get(payload.email)

      return await user.merge({
        password: payload.password,
        avatar: user.$original.avatar, // For mutate hook and remove uploads in avatar path
      }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async registerViaAPI(payload: RegisterValidator['schema']['props'], headers: AuthHeaders): Promise<LoginViaAPIReturnData> {
    const userPayload: Partial<ModelAttributes<User>> = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      companyName: payload.companyName,

      email: payload.email,
      password: payload.password,

      type: payload.type,
    }

    try {
      await this.codeVerify(payload)
      await RedisService.remove(RedisKeys.EMAIL_VERIFY, payload.email) // @ts-ignore

      const user: User = await UserService.create(userPayload)
      const tokens: Tokens = this.createTokens(user)

      await TokenService.createUserTokenSession(user.id, tokens.refresh, headers)

      return { user, tokens }
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async login(payload: LoginValidator['schema']['props']): Promise<User> {
    try {
      const user: User = await UserService.get(payload.email)

      if (!(await Hash.verify(user.password, payload.password)))
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Err

      return user
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async checkAdminAccess(id: User['id']): Promise<void> {
    let user: User
    const adminRoleId: RoleNames = RoleNames.ADMIN + 1
    const moderatorRoleId: RoleNames = RoleNames.MODERATOR + 1
    const roleIds: RoleNames[] = [adminRoleId, moderatorRoleId]

    try {
      user = await UserService.get(id)
    } catch (err: Err | any) {
      throw err
    }

    if (!roleIds.includes(user.roleId))
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Err
  }

  /**
   * * Private methods
   */

  private static createTokens(user: User): Tokens {
    const payload: UserTokenPayload = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      type: user.type,
    }

    return {
      access: this.createAccessToken(payload),
      refresh: this.createRefreshToken(payload)
    }
  }

  private static createAccessToken(payload: UserTokenPayload): string {
    const config: SignTokenConfig = {
      key: authConfig.access.key,
      expiresIn: authConfig.access.expire,
      algorithm: 'HS512',
    }

    return TokenService.createToken(payload, config)
  }

  private static createRefreshToken(payload: UserTokenPayload): string {
    const config: SignTokenConfig = {
      key: authConfig.refresh.key,
      expiresIn: authConfig.refresh.expire,
      algorithm: 'HS512',
    }

    return TokenService.createToken(payload, config)
  }
}
