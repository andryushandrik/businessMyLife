// * Types
import type Banner from 'App/Models/Banner'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import BannerService from 'App/Services/BannerService'
import BannerValidator from 'App/Validators/Banner/BannerValidator'
import BannerDelayValidator from 'App/Validators/Banner/BannerDelayValidator'
import { ResponseMessages } from 'Config/response'

export default class BannersController {
	public async index({ view, request, response, session, route }: HttpContextContract) {
		const baseUrl: string = route!.pattern
		const page: number = request.input('page', 1)
		try {
			const delay: number | undefined = await BannerService.getBannersDelay()
			const banners: ModelPaginatorContract<Banner> = await BannerService.paginate({
				page,
				baseUrl,
				queryString: request.qs(),
			})
			return await view.render('pages/banner/index', { banners, delay })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		return await view.render('pages/banner/create')
	}

	public async store({ request, response, session }: HttpContextContract) {
		const payload = await request.validate(BannerValidator)

		try {
			await BannerService.create(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			response.redirect().toRoute('banners.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async show({ view, response, session, params }: HttpContextContract) {
		try {
			const item: Banner = await BannerService.get(params.id)

			return view.render('pages/banner/show', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, response, session }: HttpContextContract) {
		const id: Banner['id'] = params.id

		try {
			const item: Banner = await BannerService.get(id)

			return view.render('pages/banner/edit', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ request, response, session, params }: HttpContextContract) {
		const id: Banner['id'] = params.id
		const payload = await request.validate(BannerValidator)

		try {
			await BannerService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('banners.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async updateBannersDelay({ request, response, session }: HttpContextContract) {
		const payload = await request.validate(BannerDelayValidator)

		try {
			await BannerService.updateBannersDelay(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, response, session }: HttpContextContract) {
		const id: Banner['id'] = params.id

		try {
			await BannerService.delete(id)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
