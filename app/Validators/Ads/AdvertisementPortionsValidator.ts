// * Types
import { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getAdvertisementTypesRules } from '../Rules/Ads/ads'

export default class AdvertisementPortionsValidator extends IndexValidator {
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		limit: schema.number(),
		adsTypeId: schema.number(getAdvertisementTypesRules()),
	})

	public messages: CustomMessages = this.messages
}
