import PremiumFranchiseFilterValidator from 'App/Validators/Offer/PremiumFranchiseFilterValidator'
import PremiumFranchise from 'App/Models/Offer/PremiumFranchise'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'
import PremiumFranchiseService from 'App/Services/Offer/PremiumFranchiseService'
import { PaginateConfig } from 'Contracts/services'

export default class PremiumFranchiseController {
	public async paginate({ route, session, request, view, response }: HttpContextContract) {
		let payload: PremiumFranchiseFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)

		const config: PaginateConfig<PremiumFranchise> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
		}
		try {
			if (isFiltered) {
				payload = await request.validate(PremiumFranchiseFilterValidator)

				config.orderBy = payload.orderBy
				config.orderByColumn = payload.orderByColumn
			}
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const franchises: ModelPaginatorContract<PremiumFranchise> = await PremiumFranchiseService.paginate(config, payload)
			return view.render('pages/offer/premium/index', {
				franchises,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
