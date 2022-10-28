// * Types
import type User from 'App/Models/User/User'
import type Area from 'App/Models/Offer/Area'
import type Offer from 'App/Models/Offer/Offer'
import type Subsection from 'App/Models/Offer/Subsection'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import AreaService from 'App/Services/Offer/AreaService'
import OfferService from 'App/Services/Offer/OfferService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import SubsectionService from 'App/Services/Offer/SubsectionService'
import OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class OffersController {
  public async paginate({ request, response }: HttpContextContract) {
    let payload: OfferFilterValidator['schema']['props']

    try {
      payload = await request.validate(OfferFilterValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const config: PaginateConfig<Offer> = {
        page: payload.page,
        limit: payload.limit,
        orderBy: payload.orderBy,
        orderByColumn: payload.orderByColumn,
      }
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateUserOffers({ request, response, params }: HttpContextContract) {
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
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginateUserOffers(userId, {
        ...payload,
        preloadArea: true,
        withoutBanned: true,
        withoutArchived: true,
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async getAllAreas({ response }: HttpContextContract) {
    try {
      const areas: Area[] = await AreaService.getAll()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, areas))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async getAllSubsections({ response, params }: HttpContextContract) {
    const areaId: Area['id'] = params.areaId

    try {
      const subsections: Subsection[] = await SubsectionService.getAll(areaId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, subsections))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
