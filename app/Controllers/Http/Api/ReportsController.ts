// * Types
import type ReportType from 'App/Models/Report/ReportType'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import ReportService from 'App/Services/Report/ReportService'
import ReportValidator from 'App/Validators/Report/ReportValidator'
import ReportTypeService from 'App/Services/Report/ReportTypeService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class ReportsController {
	public async getAllUserTypes({ response }: HttpContextContract) {
		try {
			const types: ReportType[] = await ReportTypeService.getAll('user')

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, types))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async getAllOfferTypes({ response }: HttpContextContract) {
		try {
			const types: ReportType[] = await ReportTypeService.getAll('offer')

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, types))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async create({ request, response }: HttpContextContract) {
		let payload: ReportValidator['schema']['props']

		try {
			payload = await request.validate(ReportValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			await ReportService.create(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
