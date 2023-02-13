// * Types
import type Feedback from 'App/Models/Feedback'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import FeedbackService from 'App/Services/FeedbackService'
import FeedbackFilterValidator from 'App/Validators/Feedback/FeedbackFilterValidator'
import { ResponseMessages } from 'Config/response'

export default class FeedbacksController {
	public async paginate({ view, response, request, session, route }: HttpContextContract) {
		let payload: FeedbackFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<Feedback> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
		}

		if (isFiltered) {
			payload = await request.validate(FeedbackFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const feedbacks: ModelPaginatorContract<Feedback> = await FeedbackService.paginate(config, payload)

			return view.render('pages/feedback/paginate', {
				payload,
				feedbacks,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async get({ view, session, params, response }: HttpContextContract) {
		const id: Feedback['id'] = params.id

		try {
			const item: Feedback = await FeedbackService.get(id)

			return await view.render('pages/feedback/get', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async complete({ session, params, response }: HttpContextContract) {
		const id: Feedback['id'] = params.id

		try {
			await FeedbackService.markAsCompleted(id)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('feedback.paginate')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async delete({ params, response, session }: HttpContextContract) {
		const id: Feedback['id'] = params.id

		try {
			await FeedbackService.delete(id)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}
}
