// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import UserService from 'App/Services/User/UserService'
import { ResponseMessages } from 'Config/response'

export default class IndexController {
  public static async connect(userId: User['id']): Promise<boolean> {
    try {
      await UserService.get(userId)

      return true
    } catch (err: Err | any) {
      Logger.error(ResponseMessages.SOCKET_USER_ID_UNDEFINED)
      return false
    }
  }
}
