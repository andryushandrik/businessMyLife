import OurPartnersService  from 'App/Services/OurPartnersService';
// * Types
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import OurPartner from 'App/Models/OurPartner'

export default class OurPartnersController {
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
			const ourPartners: ModelPaginatorContract<OurPartner> = await OurPartnersService.paginate(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, ourPartners))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
