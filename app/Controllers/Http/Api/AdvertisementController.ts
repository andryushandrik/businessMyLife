import Advertisement from 'App/Models/Advertisement'
// * Types
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import AdvertisementService from 'App/Services/AdvertisementService'

export default class AdvertisementController {
	public async show({ response }: HttpContextContract) {
		try {
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const advertisements: Advertisement[] = await AdvertisementService.getAll(Advertisement)
			return response
				.status(200)
				.send(new ResponseService(ResponseMessages.SUCCESS, advertisements))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
