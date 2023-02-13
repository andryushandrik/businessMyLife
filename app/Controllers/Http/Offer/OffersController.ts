// * Types
import type User from 'App/Models/User/User'
import type Area from 'App/Models/Offer/Area'
import type Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { OfferServicePaginateConfig } from 'Contracts/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import OfferService from 'App/Services/Offer/OfferService'
import OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'
import OfferBlockDescriptionValidator from 'App/Validators/Offer/OfferBlockDescriptionValidator'
import { OFFER_CATEGORIES } from 'Config/offer'
import { SESSION_AUTH_KEY } from 'Config/session'
import { ResponseMessages } from 'Config/response'

export default class OffersController {
	public async paginate({ request, response, route, view, session }: HttpContextContract) {
		let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: OfferServicePaginateConfig = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
			aggregates: ['reports'],
			relations: ['user', 'subsection'],

			isVerified: true,
		}

		if (isFiltered) {
			payload = await request.validate(OfferFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const areas: Area[] = await AreaService.getAll()
			const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

			return view.render('pages/offer/paginate', {
				areas,
				offers,
				payload,
				categories: OFFER_CATEGORIES,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async paginateCurrentUserOffers({ request, response, route, view, session }: HttpContextContract) {
		let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
		const titleFromController = 'Мои объявления'
		const isFiltered: boolean = request.input('isFiltered', false)
		const currentUserId: User['id'] = (session.get(SESSION_AUTH_KEY) as User).id
		const config: OfferServicePaginateConfig = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),

			userId: currentUserId,

			relations: ['user', 'subsection'],
		}

		if (isFiltered) {
			payload = await request.validate(OfferFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const areas: Area[] = await AreaService.getAll()
			const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

			return view.render('pages/offer/paginate', {
				areas,
				offers,
				payload,
				titleFromController,
				categories: OFFER_CATEGORIES,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async paginateNotVerifiedOffers({ request, response, route, view, session }: HttpContextContract) {
		let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: OfferServicePaginateConfig = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),

			isVerified: false,

			relations: ['user', 'subsection'],
		}

		if (isFiltered) {
			payload = await request.validate(OfferFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const areas: Area[] = await AreaService.getAll()
			const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

			return view.render('pages/offer/paginate', {
				areas,
				offers,
				payload,
				isModeratePage: true,
				categories: OFFER_CATEGORIES,
				titleFromController: 'Модерация',
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async get({ view, params, response, session }: HttpContextContract) {
		const id: Offer['id'] = params.id

		try {
			const item: Offer = await OfferService.get(id, {
				relations: ['user', 'subsection', 'images'],
			})
			return view.render('pages/offer/get', { item, categoriesForUser: OFFER_CATEGORIES })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async updateBlockDescription({ request, response, session, params }: HttpContextContract) {
		const id: Offer['id'] = params.id
		const payload = await request.validate(OfferBlockDescriptionValidator)

		try {
			await OfferService.updateBlockDescription(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	/**
	 * * Archive
	 */

	public async archive({ params, response, session }: HttpContextContract) {
		const id: Offer['id'] = params.id

		try {
			await OfferService.actions(id, 'archive', true)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	public async unarchive({ params, response, session }: HttpContextContract) {
		const id: Offer['id'] = params.id

		try {
			await OfferService.actions(id, 'archive', false)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	/**
	 * * Ban
	 */

	public async ban({ params, response, session }: HttpContextContract) {
		const id: Offer['id'] = params.id

		try {
			await OfferService.actions(id, 'ban', true)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	public async unban({ params, response, session }: HttpContextContract) {
		const id: Offer['id'] = params.id

		try {
			await OfferService.actions(id, 'ban', false)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	/**
	 * * Verify
	 */

	public async verifyAll({ response, session }: HttpContextContract) {
		try {
			await OfferService.verifyAll()

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	public async verify({ params, response, session }: HttpContextContract) {
		const id: Offer['id'] = params.id

		try {
			await OfferService.actions(id, 'verify', true)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	public async unverify({ params, response, session }: HttpContextContract) {
		const id: Offer['id'] = params.id

		try {
			await OfferService.actions(id, 'verify', false)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}
}
