// * Types
import type News from 'App/Models/News'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import NewsService from 'App/Services/NewsService'
import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class NewsController {
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
			const news: ModelPaginatorContract<News> = await NewsService.paginate(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, news))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async get({ params, response }: HttpContextContract) {
		const slug: News['slug'] = params.slug

		try {
			const item: News = await NewsService.get(slug)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
