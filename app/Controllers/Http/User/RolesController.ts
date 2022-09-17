// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import RoleService from 'App/Services/User/RoleService'
import { RoleNames } from 'Config/user'
import { ResponseMessages } from 'Config/response'

export default class RolesController {
  public async changeRoleToModerator({ response, params, session }: HttpContextContract) {
    let userId: User['id'] = params.userId

    try {
      await RoleService.changeRole(userId, RoleNames.MODERATOR)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async changeRoleToUser({ response, params, session }: HttpContextContract) {
    let userId: User['id'] = params.userId

    try {
      await RoleService.changeRole(userId, RoleNames.USER)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
