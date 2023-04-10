import Payment from 'App/Models/Payment'
import PaymentFilterValidator from 'App/Validators/Payment/PaymentFilterValidator'
// * Types
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import PaymentService from 'App/Services/PaymentService'

export default class PaymentsController {
	public async index({ view, session, request, route, response }: HttpContextContract) {
		let payload: PaymentFilterValidator['schema']['props'] | undefined = undefined
		const titleFromController = 'Все пополнения'
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<Payment> = {
			baseUrl: route!.pattern,
			queryString: request.qs(),
			page: request.input('page', 1),
		}

		if (isFiltered) {
			payload = await request.validate(PaymentFilterValidator)
			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const payments: ModelPaginatorContract<Payment> = await PaymentService.paginate(config, payload)
			return view.render('pages/payments/index', {
				payments,
				payload,
				titleFromController,
			})
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async truncate({ session, response }: HttpContextContract) {
		try {
			await PaymentService.truncate()
			return response.redirect('/payments')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
