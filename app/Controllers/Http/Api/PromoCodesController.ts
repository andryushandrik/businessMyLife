import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PromoCodeService from 'App/Services/PromoCodeService'

export default class PromoCodesController {
	public async checkIsValid({ request }: HttpContextContract) {
		const code: string = request.body().promoCode
		const isPromoValid = await PromoCodeService.getByCode(code)
		if (isPromoValid) {
			return true
		}
		return false
	}
}
