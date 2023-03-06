import Logger from '@ioc:Adonis/Core/Logger'
import { PaymentMethods } from './../../../../../config/payment'
import PremiumFranchiseValidator from 'App/Validators/Offer/PremiumFranchiseValidator'
import PremiumFranchise from 'App/Models/Offer/PremiumFranchise'
import PremiumFranchiseService from 'App/Services/Offer/PremiumFranchiseService'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import ExceptionService from 'App/Services/ExceptionService'
import ResponseService from 'App/Services/ResponseService'
import ApiValidator from 'App/Validators/ApiValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'
import BalanceService from 'App/Services/BalanceService'

export default class PremiumFranchiseController {
	public async paginate({ request, response }: HttpContextContract) {
		let payload: ApiValidator['schema']['props']

		try {
			payload = await request.validate(ApiValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const franchises: ModelPaginatorContract<PremiumFranchise> = await PremiumFranchiseService.paginate(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, franchises))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
	public async create({ request, response }: HttpContextContract) {
		let payload: PremiumFranchiseValidator['schema']['props']

		const currentUserId = request.currentUserId

		const paymentMethod = request.body().paymentMethod ? PaymentMethods[request.body().paymentMethod] : PaymentMethods.EXTERNAL
		try {
			payload = await request.validate(PremiumFranchiseValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const premiumFranchise: PremiumFranchise = await PremiumFranchiseService.create(currentUserId, paymentMethod, payload)

			const paymentDescription = `Пользователь ${currentUserId} купил премиальное размещение франшизы ${payload.offerId}. ID премиальной франшизы ${premiumFranchise.id} `

			await BalanceService.buy(currentUserId, PremiumFranchise, premiumFranchise.id, paymentDescription, 0, paymentMethod)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, premiumFranchise))
		} catch (err: Err | any) {
			Logger.error(err)
			throw new ExceptionService(err)
		}
	}
}
