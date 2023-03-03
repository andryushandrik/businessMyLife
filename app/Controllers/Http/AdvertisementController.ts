import AdvertisementType from 'App/Models/Ads/AdvertisementType'
import Logger from '@ioc:Adonis/Core/Logger'
import SubsectionService from 'App/Services/Offer/SubsectionService'
import UserService from 'App/Services/User/UserService'
import Subsection from 'App/Models/Offer/Subsection'
import AdvertisementService from 'App/Services/AdvertisementService'
import Advertisement from 'App/Models/Ads/Advertisement'
// * Types
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import { ResponseCodes, ResponseMessages } from 'Config/response'
import User from 'App/Models/User/User'
import MyAdvertisementValidator from 'App/Validators/Ads/MyAdvertisementValidator'
import ExceptionService from 'App/Services/ExceptionService'

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
					limit,
				},
			)
			return await view.render('pages/ads/index', { ads })
		} catch (err: Err | any) {
			Logger.error(err)
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
					limit,
				},
			)
			return await view.render('pages/ads/moderation', { ads })
		} catch (err: Err | any) {
			Logger.error(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async getMyAds({ view, request, response, session, route }: HttpContextContract) {
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
					limit,
					userId: request.currentUserId,
				},
			)
			return await view.render('pages/ads/myAds', { ads })
		} catch (err: Err | any) {
			Logger.error(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view, session, response }: HttpContextContract) {
		try {
			const subsections: Subsection[] = await Subsection.query()
			const adsTypes: AdvertisementType[] = await AdvertisementType.query()
			return await view.render('pages/ads/create', { subsections, adsTypes })
		} catch (error) {
			Logger.error(error)
			session.flash('error', error.message)
			return response.redirect().back()
		}
	}

	public async update({ request, response, session, params }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		let payload: MyAdvertisementValidator['schema']['props']


    try {
			payload = await request.validate(MyAdvertisementValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const item = await AdvertisementService.get(id)
			if (item.userId !== request.currentUserId) {
				throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.FORBIDDEN } as Err
			}
			await AdvertisementService.update(id, payload)
			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('ads.my')
		} catch (err: Err | any) {
			Logger.error(err)
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

	public async edit({ view, params, response, session, request }: HttpContextContract) {
		const id: Advertisement['id'] = params.id
		try {
			const item: Advertisement = await AdvertisementService.get(id)
			if (item.userId !== request.currentUserId) {
				throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.FORBIDDEN } as Err
			}
			const users = await User.query()
			const subsections: Subsection[] = await Subsection.query()
			const adsTypes: AdvertisementType[] = await AdvertisementType.query()
			return view.render('pages/ads/edit', { item, users, subsections, adsTypes })
		} catch (err: Err | any) {
			Logger.error(err)
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
    let payload: MyAdvertisementValidator['schema']['props']

    try {
			payload = await request.validate(MyAdvertisementValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}
		try {
			await AdvertisementService.create({ ...payload, userId: request.currentUserId, isVerified: true })
			session.flash('success', ResponseMessages.SUCCESS)
			response.redirect().toRoute('ads.my')
		} catch (err: Err | any) {
			Logger.error(err)
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

