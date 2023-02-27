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

export default class AdvertisementController {
	public async show({ request, response }: HttpContextContract) {
		let payload: AdvertisementFilterValidator['schema']['props']

		try {
			payload = await request.validate(AdvertisementFilterValidator)
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

	public async create({ request, response }: HttpContextContract) {
		const payload = await request.validate(AdvertisementValidator)
		payload.userId = request.currentUserId
		try {
			const advertisements = await AdvertisementService.create(payload)
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, { advertisements }))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
