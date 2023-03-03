// * Types
import { CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getAdsDescriptionRules, getAdsFileOptions, getAdvertisementTypesRules } from '../Rules/Ads/ads'
import { getSubsectionIdRules } from '../Rules/Offer/subsection'

export default class MyAdvertisementValidator extends IndexValidator {
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		description: schema.string({ trim: true }, getAdsDescriptionRules()),
		adsTypeId: schema.number(getAdvertisementTypesRules()),
		subsectionId: schema.number(getSubsectionIdRules()),
		link: schema.string(),
		/**
     * * Optional fields
		 */
    placedForMonths: schema.number([rules.unsigned(), rules.range(3, 6)]),
		image: schema.file.optional(getAdsFileOptions()),
		isVerified: schema.boolean.optional(),
		viewsCount: schema.number.optional(),
	})

	public messages: CustomMessages = this.messages
}
