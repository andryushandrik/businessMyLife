// * Types
import type ReportType from 'App/Models/Report/ReportType'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ReportTypeService from 'App/Services/Report/ReportTypeService'
import ReportTypeValidator from 'App/Validators/Report/ReportTypeValidator'
import ReportTypeFilterValidator from 'App/Validators/Report/ReportTypeFilterValidator'
import { ResponseMessages } from 'Config/response'

export default class ReportTypesController {
	public async index({ request, response, route, view, session }: HttpContextContract) {
		let payload: ReportTypeFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<ReportType> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
		}

		if (isFiltered) {
			payload = await request.validate(ReportTypeFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const reportTypes: ModelPaginatorContract<ReportType> = await ReportTypeService.paginate(config, payload)

			return view.render('pages/reportType/index', {
				payload,
				reportTypes,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		return view.render('pages/reportType/create')
	}

	public async store({ request, session, response }: HttpContextContract) {
		const payload = await request.validate(ReportTypeValidator)

		try {
			await ReportTypeService.create(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('report_types.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ params, view, session, response }: HttpContextContract) {
		const id: ReportType['id'] = params.id

		try {
			const item: ReportType = await ReportTypeService.get(id)

			return view.render('pages/reportType/edit', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ params, request, session, response }: HttpContextContract) {
		const id: ReportType['id'] = params.id
		const payload = await request.validate(ReportTypeValidator)

		try {
			await ReportTypeService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('report_types.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, session, response }: HttpContextContract) {
		const id: ReportType['id'] = params.id

		try {
			await ReportTypeService.delete(id)
			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
