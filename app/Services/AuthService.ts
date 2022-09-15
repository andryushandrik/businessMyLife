// * Types
import type User from 'App/Models/User/User'
import type LoginValidator from 'App/Validators/LoginValidator'
import type { Err } from 'Contracts/response'
// * Types

import Hash from '@ioc:Adonis/Core/Hash'
import UserService from './User/UserService'
import { RoleNames } from 'Config/user'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class AuthService {
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
}
