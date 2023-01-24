// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getPartnersTitleRules, getPartnerVideoRules } from '../Rules/partners'

export default class PartnerWithVideoValidator extends IndexValidator {
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		title: schema.string({ trim: true }, getPartnersTitleRules()),
		media: schema.string({ trim: true }, getPartnerVideoRules()),
		mediaType: schema.boolean(),

		/**
		 * * Optional fields
		 */

		isTitleLink: schema.boolean.optional(),
	})

	public messages: CustomMessages = this.messages
}
