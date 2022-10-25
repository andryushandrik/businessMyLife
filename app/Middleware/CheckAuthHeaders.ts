// * Types
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CheckAuthHeaders {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    try {
      if (
        !request.header('User-Agent') ||
        !request.header('User-Fingerprint') ||
        !request.ip()
      ) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.MISS_AUTH_HEADERS } as Err

      await next()
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
