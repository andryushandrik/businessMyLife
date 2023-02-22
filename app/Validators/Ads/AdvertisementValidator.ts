// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getUserIdRules } from '../Rules/User/user'
import { getAdsDescriptionRules, getAdsFileOptions, getAdvertisementPlacedUntilValidator } from '../Rules/ads'
import { getSubsectionIdRules } from '../Rules/Offer/subsection'

export default class AdvertisementValidator extends IndexValidator {
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		description: schema.string({ trim: true }, getAdsDescriptionRules()),
		paymentStatus: schema.string({ trim: true }),
		userId: schema.number(getUserIdRules()),
		placedAt: schema.date.optional({ format: 'dd MMMM, yyyy' }),
		placedUntill: schema.date({ format: 'dd MMMM, yyyy' }, getAdvertisementPlacedUntilValidator()),

		/**
		 * * Optional fields
		 */

		image: schema.file.optional(getAdsFileOptions()),
    place: schema.enum(['offer','category']),
    subsectionId: schema.number(getSubsectionIdRules())
	})

	public messages: CustomMessages = this.messages
}
