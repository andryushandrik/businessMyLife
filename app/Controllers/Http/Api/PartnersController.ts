// * Types
import type Partner from 'App/Models/Partner'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import PartnerService from 'App/Services/PartnerService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class PartnersController {
	public async paginate({ request, response }: HttpContextContract) {
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
			const partners: ModelPaginatorContract<Partner> = await PartnerService.paginate({ ...payload, queryString: request.qs() })

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, partners))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
