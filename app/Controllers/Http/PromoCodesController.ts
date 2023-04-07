// * Types
import type PromoCode from 'App/Models/PromoCode'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import PromoCodeService from 'App/Services/PromoCodeService'
import PromoCodeValidator from 'App/Validators/PromoCode/PromoCodeValidator'
import PromoCodeFilterValidator from 'App/Validators/PromoCode/PromoCodeFilterValidator'
import { ResponseMessages } from 'Config/response'

export default class PromoCodesController {
	public async index({ request, response, route, view, session }: HttpContextContract) {
		let payload: PromoCodeFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<PromoCode> = {
			baseUrl: route!.pattern,
      queryString: request.qs(),
			page: request.input('page', 1),
			limit: request.input('limit', 5),
		}

		if (isFiltered) {
			payload = await request.validate(PromoCodeFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const promoCodes: ModelPaginatorContract<PromoCode> = await PromoCodeService.paginate(config, payload)

			return view.render('pages/promoCode/index', {
				payload,
				promoCodes,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		return view.render('pages/promoCode/create')
	}

	public async store({ request, session, response }: HttpContextContract) {
		const payload = await request.validate(PromoCodeValidator)

		try {
			await PromoCodeService.create(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('promo_codes.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ params, view, session, response }: HttpContextContract) {
		const id: PromoCode['id'] = params.id

		try {
			const item: PromoCode = await PromoCodeService.get(id)

			return view.render('pages/promoCode/edit', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ params, request, session, response }: HttpContextContract) {
		const id: PromoCode['id'] = params.id
		const payload = await request.validate(PromoCodeValidator)

		try {
			await PromoCodeService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('promo_codes.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, session, response }: HttpContextContract) {
		const id: PromoCode['id'] = params.id

		try {
			await PromoCodeService.delete(id)
			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
