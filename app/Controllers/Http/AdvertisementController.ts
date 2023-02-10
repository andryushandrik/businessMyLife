import { DateTime } from 'luxon'
import AdvertisementValidator from 'App/Validators/Ads/AdvertisementValidator'
import AdvertisementService from 'App/Services/AdvertisementService'
import Advertisement from 'App/Models/Advertisement'
// * Types
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import { ResponseMessages } from 'Config/response'
import User from 'App/Models/User/User'

export default class AdvertisementController {
	public async index({ view, request, response, session, route }: HttpContextContract) {
		const baseUrl: string = route!.pattern
		const page: number = request.input('page', 1)

		try {
			const ads: ModelPaginatorContract<Advertisement> = await AdvertisementService.paginate({
				page,
				baseUrl,
				relations: ['owner'],
			})
			return await view.render('pages/ads/index', { ads })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		const users: User[] = await User.query()
		return await view.render('pages/ads/create', { users })
	}

	public async update({ request, response, session, params }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		const payload = await request.validate(AdvertisementValidator)
		payload.placedAt = DateTime.now()

		try {
			await AdvertisementService.update(id, payload)
			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('ads.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, response, session }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		try {
			const users = await User.query()
			const item: Advertisement = await AdvertisementService.get(id)

			return view.render('pages/ads/edit', { item, users })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
	public async store({ request, response, session }: HttpContextContract) {
		try {
			const payload = await request.validate(AdvertisementValidator)
			payload.placedAt = DateTime.now()
			await AdvertisementService.create(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			response.redirect().toRoute('ads.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}

