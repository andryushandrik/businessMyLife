import Logger from '@ioc:Adonis/Core/Logger'
import SubsectionService from 'App/Services/Offer/SubsectionService'
import UserService from 'App/Services/User/UserService'
import Subsection from 'App/Models/Offer/Subsection'
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
		const limit: number = request.input('limit', 5)

		try {
			const ads: ModelPaginatorContract<Advertisement> = await AdvertisementService.paginate(
				{
					page,
					limit,
					baseUrl,
				},
				{
					page,
					isVerified: true,
					place: undefined,
					subsectionId: undefined,
					limit,
					orderBy: undefined,
					orderByColumn: undefined,
				},
			)
			return await view.render('pages/ads/index', { ads })
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async moderation({ view, request, response, session, route }: HttpContextContract) {
		const baseUrl: string = route!.pattern
		const page: number = request.input('page', 1)
		const limit: number = request.input('limit', 5)

		try {
			const ads: ModelPaginatorContract<Advertisement> = await AdvertisementService.paginate(
				{
					page,
					limit,
					baseUrl,
				},
				{
					page,
					isVerified: false,
					place: undefined,
					subsectionId: undefined,
					limit,
					orderBy: undefined,
					orderByColumn: undefined,
				},
			)
			return await view.render('pages/ads/moderation', { ads })
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		const users: User[] = await User.query()
		const subsections: Subsection[] = await Subsection.query()
		return await view.render('pages/ads/create', { users, subsections })
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

	public async verify({ response, session, params }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		try {
			await AdvertisementService.verify(id)
			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('ads.index')
		} catch (err: Err | any) {
			Logger.error(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async unverify({ response, session, params }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		try {
			await AdvertisementService.unverify(id)
			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('ads.moderation')
		} catch (err: Err | any) {
			Logger.error(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, response, session }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		try {
			const users = await User.query()
			const subsections: Subsection[] = await Subsection.query()

			const item: Advertisement = await AdvertisementService.get(id)

			return view.render('pages/ads/edit', { item, users, subsections })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async show({ view, params, response, session }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		try {
			const item: Advertisement = await AdvertisementService.get(id)
			const subsection: Subsection = await SubsectionService.get(item.subsectionId)
			const user = await UserService.get(item.userId)
			return view.render('pages/ads/show', { item, user, subsection })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async store({ request, response, session }: HttpContextContract) {
		const payload = await request.validate(AdvertisementValidator)
		try {
			payload.placedAt = DateTime.now()
			await AdvertisementService.create(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			response.redirect().toRoute('ads.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, response, session }: HttpContextContract) {
		const id: Advertisement['id'] = params.id

		try {
			await AdvertisementService.delete(id)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
