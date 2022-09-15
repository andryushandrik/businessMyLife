// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import UserService from 'App/Services/User/UserService'
import BlockUntilValidator from 'App/Validators/BlockUntilValidator'
import { RoleNames } from 'Config/user'
import { ResponseMessages } from 'Config/response'

export default class UsersController {
  public async paginate({ view, session, request, route, response }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const users: ModelPaginatorContract<User> = await UserService.paginate({ page, baseUrl })

      return view.render('pages/user/paginate', { users })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async get({ view, session, params, response }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      const item: User = await UserService.get(id, { relations: ['images'] })

      return view.render('pages/user/get', { item, RoleNames })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async delete({ response, params, session }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      await UserService.delete(id)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async blockUntil({ request, response, params, session }: HttpContextContract) {
    const id: User['id'] = params.id
    const payload = await request.validate(BlockUntilValidator)

    try {
      await UserService.blockUntil(id, payload)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
