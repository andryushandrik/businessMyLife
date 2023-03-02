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
import { PaymentStatuses } from 'Config/payment'

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

		try {
			payload = await request.validate(PremiumFranchiseValidator)
      payload.paymentStatus = PaymentStatuses.PENDING
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
      const premiumFranchise = await PremiumFranchise.create(payload)
      const paymentDescription = `Пользователь ${request.currentUserId} купил премиальное размещение франшизы ${ payload.offerId}. ID премиальной франшизы ${premiumFranchise.id} `
      await BalanceService.buy(request.currentUserId, paymentDescription, 0)
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, premiumFranchise))
		} catch (err: Err | any) {
			console.log(err)
			throw new ExceptionService(err)
		}
	}
}
