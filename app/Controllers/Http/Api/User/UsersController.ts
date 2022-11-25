// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ModelObject, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import UserService from 'App/Services/User/UserService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import UserValidator from 'App/Validators/User/UserValidator'
import UpdatePasswordValidator from 'App/Validators/User/UpdatePassword'
import UserFilterValidator from 'App/Validators/User/UserFilterValidator'
import EmailVerifyValidator from 'App/Validators/User/UpdateEmail/EmailVerifyValidator'
import UpdateEmailValidator from 'App/Validators/User/UpdateEmail/UpdateEmailValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class UsersController {
  public async paginate({ request, response }: HttpContextContract) {
    let payload: UserFilterValidator['schema']['props']

    try {
      payload = await request.validate(UserFilterValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const config: PaginateConfig<User> = {
        page: payload.page,
        limit: payload.limit,
        orderBy: payload.orderBy,
        orderByColumn: payload.orderByColumn,
      }
      const offers: ModelPaginatorContract<User> = await UserService.paginate(config, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    const id: User['id'] = params.id
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      let item: User | ModelObject = await UserService.get(id)

      if (currentUserId)
        item = await item.getForUser(currentUserId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const id: User['id'] = params.id
    let payload: UserValidator['schema']['props']

    try {
      payload = await request.validate(UserValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: User = await UserService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async updatePassword({ request, response, params }: HttpContextContract) {
    const currentUserId: User['id'] = params.currentUserId
    let payload: UpdatePasswordValidator['schema']['props']

    try {
      payload = await request.validate(UpdatePasswordValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await UserService.updatePassword(currentUserId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * Update email
   */

  public async updateEmail({ request, response, params }: HttpContextContract) {
    const currentUserId: User['id'] = params.currentUserId
    let payload: UpdateEmailValidator['schema']['props']

    try {
      payload = await request.validate(UpdateEmailValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      await UserService.updateEmail(currentUserId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async emailVerify({ request, response }: HttpContextContract) {
    let payload: EmailVerifyValidator['schema']['props']

    try {
      payload = await request.validate(EmailVerifyValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      await UserService.emailVerify(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
