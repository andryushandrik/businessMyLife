// * Types
import type User from 'App/Models/User/User'
import type Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { OfferServicePaginateConfig } from 'Contracts/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import OfferService from 'App/Services/Offer/OfferService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'
import OfferFavoriteValidator from 'App/Validators/Offer/OfferFavoriteValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class OffersFavoriteController {
	public async paginate({ request, response, params }: HttpContextContract) {
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

				isBanned: false,
				isVerified: true,
				isArchived: false,

				userIdForFavorites: userId,
			}
			const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, offers))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async create({ request, response }: HttpContextContract) {
		let payload: OfferFavoriteValidator['schema']['props']

		try {
			payload = await request.validate(OfferFavoriteValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			await OfferService.favoriteAction(payload, 'attach')

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async delete({ request, response }: HttpContextContract) {
		let payload: OfferFavoriteValidator['schema']['props']

		try {
			payload = await request.validate(OfferFavoriteValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			await OfferService.favoriteAction(payload, 'detach')

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
