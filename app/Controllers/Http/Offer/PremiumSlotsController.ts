import PremiumSlotsValidator from 'App/Validators/PremiumSlots/PremiumSlotsValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import PremiumSlot from 'App/Models/Offer/PremiumSlot'
import ExceptionService from 'App/Services/ExceptionService'
import PremiumSlotService from 'App/Services/PremiumSlotService'
import ApiValidator from 'App/Validators/ApiValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'

export default class PremiumSlotsController {
	public async paginate({ session, request, view, response }: HttpContextContract) {
		let payload: ApiValidator['schema']['props']

		try {
			payload = await request.validate(ApiValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const slots: ModelPaginatorContract<PremiumSlot> = await PremiumSlotService.paginate(payload)

			return view.render('pages/premium/slots/index', {
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
			await PremiumSlotService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('offer.premium.paginate')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
