// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import { schema } from '@ioc:Adonis/Core/Validator'
import IndexValidator from './IndexValidator'

export default class AdvertisementValidator extends IndexValidator {
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		name: schema.string({ trim: true }),
		isVisible: schema.boolean.optional(),
		link: schema.string({ trim: true }),
		image: schema.file(),

		/**
		 * * Optional fields
		 */
	})

	public messages: CustomMessages = this.messages
}
