import OurPartnersService from 'App/Services/OurPartnersService'
// * Types
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseMessages } from 'Config/response'
import OurPartner from 'App/Models/OurPartner'

export default class OurPartnersController {
	public async getAll({ response }: HttpContextContract) {
		try {
			const ourPartners: OurPartner[] = await OurPartnersService.getAll()

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, ourPartners))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
