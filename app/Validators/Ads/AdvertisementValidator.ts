// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getBannerDescriptionRules, getBannerFileOptions } from '../Rules/banner'
import { getUserIdRules } from '../Rules/User/user'
import { getAdvertisementPlacedUntilValidator } from '../Rules/ads'

export default class AdvertisementValidator extends IndexValidator {
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		description: schema.string({ trim: true }, getBannerDescriptionRules()),
		paymentStatus: schema.string({ trim: true }),
		userId: schema.number(getUserIdRules()),
		placedAt: schema.date.optional({ format: 'dd MMMM, yyyy' }),
		placedUntill: schema.date({ format: 'dd MMMM, yyyy' }, getAdvertisementPlacedUntilValidator()),


		/**
		 * * Optional fields
		 */

		offerImage: schema.file.optional(getBannerFileOptions()),
		subsectionImage: schema.file.optional(getBannerFileOptions()),
	})

	public messages: CustomMessages = this.messages
}

