// * Types
import type Area from 'App/Models/Offer/Area'
import type Subsection from 'App/Models/Offer/Subsection'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import SubsectionService from 'App/Services/Offer/SubsectionService'
import SubsectionValidator from 'App/Validators/Offer/SubsectionValidator'
import SubsectionFilterValidator from 'App/Validators/Offer/SubsectionFilterValidator'
import { ResponseMessages } from 'Config/response'

export default class SubsectionsController {
	public async index({ request, response, route, view, session }: HttpContextContract) {
		let payload: SubsectionFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<Subsection> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
      queryString: request.qs(),
			limit: request.input('limit', 5),
			relations: ['area'],
		}

		if (isFiltered) {
			payload = await request.validate(SubsectionFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const subsections: ModelPaginatorContract<Subsection> = await SubsectionService.paginate(config, payload)

			return view.render('pages/subsection/index', {
				payload,
				subsections,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view, session, response }: HttpContextContract) {
		try {
			const areas: Area[] = await AreaService.getAll()

			return await view.render('pages/subsection/create', { areas })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async store({ request, response, session }: HttpContextContract) {
		const payload = await request.validate(SubsectionValidator)
		try {
			await SubsectionService.create(payload)
			session.flash('success', ResponseMessages.SUCCESS)
			response.redirect().toRoute('subsections.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, response, session }: HttpContextContract) {
		const id: Area['id'] = params.id

		try {
			const areas: Area[] = await AreaService.getAll()
			const item: Subsection = await SubsectionService.get(id)

			return view.render('pages/subsection/edit', { item, areas })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ request, response, session, params }: HttpContextContract) {
		const id: Subsection['id'] = params.id
		const payload = await request.validate(SubsectionValidator)

		try {
			await SubsectionService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('subsections.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, response, session }: HttpContextContract) {
		const id: Subsection['id'] = params.id

		try {
			await SubsectionService.delete(id)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
