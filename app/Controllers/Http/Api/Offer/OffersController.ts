import { PaymentMethods } from './../../../../../config/payment'
// * Types
import type User from 'App/Models/User/User'
import type Area from 'App/Models/Offer/Area'
import Offer from 'App/Models/Offer/Offer'
import type Subsection from 'App/Models/Offer/Subsection'
import type OfferImage from 'App/Models/Offer/OfferImage'
import type { Err } from 'Contracts/response'
import type { JSONPaginate } from 'Contracts/database'
import type { OfferServicePaginateConfig } from 'Contracts/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ModelObject, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import OfferService from 'App/Services/Offer/OfferService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import OfferValidator from 'App/Validators/Offer/OfferValidator'
import SubsectionService from 'App/Services/Offer/SubsectionService'
import OfferImageService from 'App/Services/Offer/OfferImageService'
import OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import BalanceService from 'App/Services/BalanceService'

export default class OffersController {
	public async paginate({ request, response, params }: HttpContextContract) {
		let payload: OfferFilterValidator['schema']['props']
		const currentUserId: User['id'] | undefined = params.currentUserId

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
			let offers: ModelPaginatorContract<Offer> | JSONPaginate = await OfferService.paginate(config, payload)

			if (currentUserId) {
				offers = offers.toJSON()
				offers.data = await Promise.all(offers.data.map(async (item: Offer) => await item.getForUser(currentUserId)))
			}

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

  public async paginateUserOnModerationffers({ request, response, params }: HttpContextContract) {
		const userId: User['id'] = params.userId
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
				userId,
				preloadArea: true,
				isArchived: false,
        isVerified: false
			}
			const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}


	public async get({ response, params }: HttpContextContract) {
		const id: Offer['id'] = params.id
		const currentUserId: User['id'] | undefined = params.currentUserId

		try {
			let item: Offer | ModelObject = await OfferService.get(id, {
				preloadArea: true,
				addViewCount: true,
				relations: ['user', 'images'],
			})

			if (currentUserId) item = await item.getForUser(currentUserId)

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
		const currentUserId = request.currentUserId
		let payload: OfferValidator['schema']['props']
		const paymentMethod = request.body().paymentMethod ? request.body().paymentMethod : PaymentMethods.INTERNAL
		try {
			payload = await request.validate(OfferValidator)
			payload.isArchived = false
			payload.isVerified = false
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const offer: Offer = await OfferService.create(payload)
			if (offer.category == 4) {
				const paymentDescription = `Пользователь ${currentUserId} купил размещение франшизы ${offer.id}.`
				let price = 6000
				if (offer.placedForMonths == 3) {
					price = 6000
				} else if (offer.placedForMonths == 6) {
					price = 11000
				}
				await BalanceService.buy(currentUserId, Offer, offer.id, paymentDescription, price, paymentMethod)
			}

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offer))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async update({ request, response, params }: HttpContextContract) {
		const id: Offer['id'] = params.id
		let payload: OfferValidator['schema']['props']
		try {
			payload = await request.validate(OfferValidator)

			payload.isVerified = false
			//payload.isArchived = true
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
}
