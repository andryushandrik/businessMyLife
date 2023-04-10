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
	public async myPayments({ session, request, route, response }: HttpContextContract) {
		let payload: PaymentFilterValidator['schema']['props'] | undefined = undefined
		const config: PaginateConfig<Payment> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			queryString: request.qs(),
			limit: request.input('limit', 5),
		}
		payload = await request.validate(PaymentFilterValidator)
		config.orderBy = payload.orderBy
		config.orderByColumn = payload.orderByColumn

		try {

			const payments: ModelPaginatorContract<Payment> = await PaymentService.paginateMyPayments(request.currentUserId, config, payload)
			return payments
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}

