// * Types
import type User from 'App/Models/User/User'
import type Area from 'App/Models/Offer/Area'
import type Offer from 'App/Models/Offer/Offer'
import type Subsection from 'App/Models/Offer/Subsection'
import type OfferImage from 'App/Models/Offer/OfferImage'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { OfferServicePaginateConfig } from 'Contracts/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import AreaService from 'App/Services/Offer/AreaService'
import OfferService from 'App/Services/Offer/OfferService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import OfferValidator from 'App/Validators/Offer/OfferValidator'
import SubsectionService from 'App/Services/Offer/SubsectionService'
import OfferImageService from 'App/Services/Offer/OfferImageService'
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
      const config: OfferServicePaginateConfig = {
        page: payload.page,
        limit: payload.limit,
        orderBy: payload.orderBy,
        orderByColumn: payload.orderByColumn,

        isBanned: false,
        isVerified: true,
        isArchived: false,
      }
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

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
        preloadArea: true,

        userId,
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

  public async get({ response, params }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      const item: Offer = await OfferService.get(id, { relations: ['user', 'images'] })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
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

  public async create({ request, response }: HttpContextContract) {
    let payload: OfferValidator['schema']['props']

    try {
      payload = await request.validate(OfferValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await OfferService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const id: Offer['id'] = params.id
    let payload: OfferValidator['schema']['props']

    try {
      payload = await request.validate(OfferValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await OfferService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.delete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async deleteImage({ response, params }: HttpContextContract) {
    const id: OfferImage['id'] = params.offerImageId

    try {
      await OfferImageService.delete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * Archive
   */

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
