// * Types
import type Area from 'App/Models/Offer/Area'
import type Report from 'App/Models/Report/Report'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import ReportService from 'App/Services/Report/ReportService'
import UserReportFilterValidator from 'App/Validators/Report/UserReportFilterValidator'
import OfferReportFilterValidator from 'App/Validators/Report/OfferReportFilterValidator'
import { OFFER_CATEGORIES } from 'Config/offer'

export default class OffersController {
	public async paginateOffersReports({ request, response, route, view, session }: HttpContextContract) {
		let payload: OfferReportFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<Report> = {
			baseUrl: route!.pattern,
			queryString: request.qs(),
			relations: ['offer', 'user'],
			page: request.input('page', 1),
		}

		if (isFiltered) {
			payload = await request.validate(OfferReportFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const areas: Area[] = await AreaService.getAll()
			const reports: ModelPaginatorContract<Report> = await ReportService.paginateOffersReports(config, payload)

			return view.render('pages/report/paginateOffersReports', {
				areas,
				reports,
				payload,
				categories: OFFER_CATEGORIES,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async paginateUsersReports({ request, response, route, view, session }: HttpContextContract) {
		let payload: UserReportFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<Report> = {
			baseUrl: route!.pattern,
			queryString: request.qs(),
			relations: ['user', 'userTo'],
			page: request.input('page', 1),
		}

		if (isFiltered) {
			payload = await request.validate(UserReportFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const reports: ModelPaginatorContract<Report> = await ReportService.paginateUsersReports(config, payload)

			return view.render('pages/report/paginateUsersReports', {
				reports,
				payload,
			})
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
