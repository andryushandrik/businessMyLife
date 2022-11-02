// * Types
import type User from 'App/Models/User/User'
import type Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import OfferService from 'App/Services/Offer/OfferService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class OffersArchivesController {
  public async paginateUserNotArchivedOffers({ request, response, params }: HttpContextContract) {
    const userId: User['id'] = params.userId
    let payload: ApiValidator['schema']['props']

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginate( {
        ...payload,
        userId,

        preloadArea: true,
        isArchived: false,
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateUserArchivedOffers({ request, response, params }: HttpContextContract) {
    const userId: User['id'] = params.userId
    let payload: ApiValidator['schema']['props']

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginate({
        ...payload,
        preloadArea: true,

        userId,
        isArchived: true,
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async archive({ response, params }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'archive', true)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async unarchive({ response, params }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'archive', false)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
