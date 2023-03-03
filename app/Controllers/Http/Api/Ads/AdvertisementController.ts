import Database from '@ioc:Adonis/Lucid/Database'
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
import { PaymentStatuses } from 'Config/payment'
let pageForUsersAds: number = 1
export default class AdvertisementController {
	public async show({ request, response }: HttpContextContract) {
		let payload: AdvertisementFilterValidator['schema']['props']
		try {
			payload = await request.validate(AdvertisementFilterValidator)
			payload.isVerified = false
		} catch (err: any) {
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

	public async showAdsByPortions({ request, response }: HttpContextContract) {
		let payload: AdvertisementPortionsValidator['schema']['props']
		payload = await request.validate(AdvertisementPortionsValidator)
		try {
			const rows = await AdvertisementService.getByPortions(payload, pageForUsersAds)
			pageForUsersAds += 1
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, rows))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async create({ request, response }: HttpContextContract) {
		const payload = await request.validate(AdvertisementValidator)
		try {
			payload.paymentStatus = PaymentStatuses.PENDING
			payload.userId = request.currentUserId
			const advertisement: Advertisement = await AdvertisementService.create(payload)
			const fullAd: Advertisement = await AdvertisementService.get(advertisement.id)
			if (payload.placedForMonths == 3) {
				const price = fullAd.adsType.priceThreeMonths
				const paymentDescription = `Пользователь ${request.currentUserId} купил рекламу ${fullAd.id} за ${price} `
				await BalanceService.buy(request.currentUserId, paymentDescription, price)
				await AdvertisementService.changePaymentStatus(fullAd.id, PaymentStatuses.SUCCESS)
			} else if (payload.placedForMonths == 6) {
				const price = fullAd.adsType.priceSixMonths
				const paymentDescription = `Пользователь ${request.currentUserId} купил рекламу ${fullAd.id} за ${price}`
				await BalanceService.buy(request.currentUserId, paymentDescription, price)
				await AdvertisementService.changePaymentStatus(fullAd.id, PaymentStatuses.SUCCESS)
			}
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, { fullAd }))
		} catch (err: Err | any) {
			Logger.error(err)
			throw new ExceptionService(err)
		}
	}
}

