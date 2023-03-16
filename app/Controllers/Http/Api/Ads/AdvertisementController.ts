import Logger from '@ioc:Adonis/Core/Logger'
import BalanceService from 'App/Services/BalanceService'
import Advertisement from 'App/Models/Ads/Advertisement'
// * Types
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import AdvertisementService from 'App/Services/AdvertisementService'
import AdvertisementValidator from 'App/Validators/Ads/AdvertisementValidator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import AdvertisementFilterValidator from 'App/Validators/Ads/AdvertisementFilterValidator'
import AdvertisementPortionsValidator from 'App/Validators/Ads/AdvertisementPortionsValidator'
import { PaymentMethods } from 'Config/payment'
export default class AdvertisementController {
	public async show({ request, response }: HttpContextContract) {
		let payload: AdvertisementFilterValidator['schema']['props']
		try {
			payload = await request.validate(AdvertisementFilterValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const ads: ModelPaginatorContract<Advertisement> = await AdvertisementService.paginate(payload, payload)
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, ads))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async getMyPublicAds({ request, response }: HttpContextContract) {
		let payload: AdvertisementFilterValidator['schema']['props']
		try {
			payload = await request.validate(AdvertisementFilterValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}
		payload.userId = request.currentUserId
    payload.isVerified = true
		try {
			const ads: ModelPaginatorContract<Advertisement> = await AdvertisementService.paginate(payload, payload)
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, ads))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

  public async getMyOnModerationAds({ request, response }: HttpContextContract) {
		let payload: AdvertisementFilterValidator['schema']['props']
		try {
			payload = await request.validate(AdvertisementFilterValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}
		payload.userId = request.currentUserId
    payload.isVerified = false
		try {
			const ads: ModelPaginatorContract<Advertisement> = await AdvertisementService.paginate(payload, payload)
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, ads))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async showAdsByPortions({ request, response }: HttpContextContract) {
		let payload: AdvertisementPortionsValidator['schema']['props']
		try {
			payload = await request.validate(AdvertisementPortionsValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}
		try {
			const rows = await AdvertisementService.getByPortions(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, rows))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async create({ request, response }: HttpContextContract) {
		let payload: AdvertisementValidator['schema']['props']
		try {
			payload = await request.validate(AdvertisementValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		const paymentMethod = request.body().paymentMethod ? PaymentMethods[request.body().paymentMethod] : PaymentMethods['INTERNAL']
		try {
			payload.userId = request.currentUserId
			const advertisement: Advertisement = await AdvertisementService.create({ ...payload })
			const fullAd: Advertisement = await AdvertisementService.get(advertisement.id)

			let price = fullAd.adsType.priceThreeMonths

			if (payload.placedForMonths == 3) {
				price = fullAd.adsType.priceThreeMonths
			} else if (payload.placedForMonths == 6) {
				price = fullAd.adsType.priceSixMonths
			}

			const paymentDescription = `Пользователь ${request.currentUserId} купил рекламу ${fullAd.id} за ${price}`
			await BalanceService.buy(request.currentUserId, Advertisement, fullAd.id, paymentDescription, price, paymentMethod)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, { fullAd }))
		} catch (err: Err | any) {
			Logger.error(err)
			throw new ExceptionService(err)
		}
	}
}

