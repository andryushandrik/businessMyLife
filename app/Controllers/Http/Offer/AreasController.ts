// * Types
import type Area from 'App/Models/Offer/Area'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import AreaValidator from 'App/Validators/Offer/AreaValidator'
import AreaFilterValidator from 'App/Validators/Offer/AreaFilterValidator'
import { ResponseMessages } from 'Config/response'

export default class AreasController {
	public async index({ request, response, route, view, session }: HttpContextContract) {
		let payload: AreaFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<Area> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
      queryString: request.qs()
		}

		if (isFiltered) {
			payload = await request.validate(AreaFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const areas: ModelPaginatorContract<Area> = await AreaService.paginate(config, payload)

			return view.render('pages/area/index', {
				areas,
				payload,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		return await view.render('pages/area/create')
	}

	public async store({ request, response, session }: HttpContextContract) {
		const payload = await request.validate(AreaValidator)

		try {
			await AreaService.create(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			response.redirect().toRoute('areas.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, response, session }: HttpContextContract) {
		const id: Area['id'] = params.id

		try {
			const item: Area = await AreaService.get(id)

			return view.render('pages/area/edit', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ request, response, session, params }: HttpContextContract) {
		const id: Area['id'] = params.id
		const payload = await request.validate(AreaValidator)

		try {
			await AreaService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('areas.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, response, session }: HttpContextContract) {
		const id: Area['id'] = params.id

		try {
			await AreaService.delete(id)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
