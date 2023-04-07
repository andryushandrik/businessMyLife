import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import PremiumSlot from 'App/Models/Offer/PremiumSlot'
import ExceptionService from 'App/Services/ExceptionService'
import PremiumSlotService from 'App/Services/PremiumSlotService'
import ResponseService from 'App/Services/ResponseService'
import ApiValidator from 'App/Validators/ApiValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'

export default class PremiumSlotsController {
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
			const slots: ModelPaginatorContract<PremiumSlot> = await PremiumSlotService.paginate({ ...payload, queryString: request.qs() })

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, slots))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async get({ params, response }: HttpContextContract) {
		const premiumSlotId: PremiumSlot['id'] = params.id

		try {
			const item: PremiumSlot = await PremiumSlotService.get(premiumSlotId)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	// public async employee({ request, response }: HttpContextContract) {
	// 	let payload: EmployeeSlotValidator['schema']['props']

	// 	try {
	// 		payload = await request.validate(EmployeeSlotValidator)
	// 	} catch (err: Err | any) {
	// 		throw new ExceptionService({
	// 			code: ResponseCodes.VALIDATION_ERROR,
	// 			message: ResponseMessages.VALIDATION_ERROR,
	// 			body: err.messages,
	// 		})
	// 	}

	// 	try {
	// 		await PremiumSlotService.employee(request.currentUserId, payload)

	// 		return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
	// 	} catch (err: Err | any) {
	// 		throw new ExceptionService(err)
	// 	}
	// }
}

