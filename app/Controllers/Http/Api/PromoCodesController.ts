import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PromoCodeService from 'App/Services/PromoCodeService'

export default class PromoCodesController {
	public async checkIsValid({ request, response }: HttpContextContract) {
		const code: string = request.body().promocode
		const isPromoValid = await PromoCodeService.getByCode(code)
		if (isPromoValid) {
			return true
		}
		return false
	}
}

