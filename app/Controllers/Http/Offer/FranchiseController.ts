import Logger from '@ioc:Adonis/Core/Logger'
// * Types
import type Area from 'App/Models/Offer/Area'
import Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { OfferServicePaginateConfig } from 'Contracts/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import OfferService from 'App/Services/Offer/OfferService'
import OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'

export default class FranchiseController {
	public async paginate({ request, response, route, view, session }: HttpContextContract) {
		let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: OfferServicePaginateConfig = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
			aggregates: ['reports'],
			relations: ['user', 'subsection', 'premiumFranchise'],

			isVerified: true,
			isArchived: false,
			isBanned: false,
		}

		config.orderBy = 'asc'
		config.orderByColumn = `${Offer.table}.id`

		if (isFiltered) {
			payload = await request.validate(OfferFilterValidator)
			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}
		try {
			const areas: Area[] = await AreaService.getAll()
			const franchises: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload, 4, true)
			return view.render('pages/offer/franchises/index', {
				areas,
				franchises,
				payload,
			})
		} catch (err: Err | any) {
			Logger.error(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async moderation({ request, response, route, view, session }: HttpContextContract) {
		let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: OfferServicePaginateConfig = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
			isVerified: false,
			aggregates: ['reports'],
			relations: ['user', 'subsection', 'premiumFranchise'],
		}

		config.orderBy = 'asc'
		config.orderByColumn = `${Offer.table}.id`

		if (isFiltered) {
			payload = await request.validate(OfferFilterValidator)
			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}
		try {
			const areas: Area[] = await AreaService.getAll()
			const franchises: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload, 4, true)
			return view.render('pages/offer/franchises/moderation', {
				areas,
				franchises,
				payload,
			})
		} catch (err: Err | any) {
			Logger.error(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async archived({ request, response, route, view, session }: HttpContextContract) {
		let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: OfferServicePaginateConfig = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
			isArchived: true,
			aggregates: ['reports'],
			relations: ['user', 'subsection', 'premiumFranchise'],
		}

		config.orderBy = 'asc'
		config.orderByColumn = `${Offer.table}.id`

		if (isFiltered) {
			payload = await request.validate(OfferFilterValidator)
			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}
		try {
			const areas: Area[] = await AreaService.getAll()
			const franchises: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload, 4, true)

			return view.render('pages/offer/franchises/archived', {
				areas,
				franchises,
				payload,
			})
		} catch (err: Err | any) {
			Logger.error(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}

