import PremiumSlotsFilterValidator from 'App/Validators/PremiumSlots/PremiumSlotsFilterValidator'
import PremiumSlotsValidator from 'App/Validators/PremiumSlots/PremiumSlotsValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import PremiumSlot from 'App/Models/Offer/PremiumSlot'
import ExceptionService from 'App/Services/ExceptionService'
import PremiumSlotService from 'App/Services/PremiumSlotService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'
import { PaginateConfig } from 'Contracts/services'

export default class PremiumSlotsController {
	public async paginate({ route, session, request, view, response }: HttpContextContract) {
		let payload: PremiumSlotsFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)

		const config: PaginateConfig<PremiumSlot> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
			limit: request.input('limit', 5),
		}
		try {
			if (isFiltered) {
				payload = await request.validate(PremiumSlotsFilterValidator)

				config.orderBy = payload.orderBy
				config.orderByColumn = payload.orderByColumn
			}
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const slots: ModelPaginatorContract<PremiumSlot> = await PremiumSlotService.paginate(config, payload)
			return view.render('pages/offer/premium/slots/index', {
				slots,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, response, session }: HttpContextContract) {
		const id: PremiumSlot['id'] = params.id

		try {
			const item: PremiumSlot = await PremiumSlotService.get(id)

			return view.render('pages/offer/premium/slots/edit', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ request, response, session, params }: HttpContextContract) {
		const id: PremiumSlot['id'] = params.id
		console.log(request.body())
		try {
      const payload = await request.validate(PremiumSlotsValidator)
			payload.isBlocked = payload.isBlocked ? true : false
			payload.image = null

			await PremiumSlotService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('offer.premium.slots.paginate')
		} catch (err: Err | any) {
			console.log(err)
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}

