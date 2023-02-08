// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import {
	getBannerDescriptionRules,
	getBannerTitleRules,
	getBannerFileOptions,
	getBannerLinkRules,
} from '../Rules/banner'

export default class BannerValidator extends IndexValidator {
	private readonly isUpdating: boolean = this.ctx.request.method() === 'PATCH'

	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		title: schema.string({ trim: true }, getBannerTitleRules()),
		description: schema.string({ trim: true }, getBannerDescriptionRules()),
		orderNumber: schema.number.optional(),
		/**
		 * * Optional fields
		 */

		image: this.isUpdating
			? schema.file.optional(getBannerFileOptions())
			: schema.file(getBannerFileOptions()),
		link: schema.string.nullableAndOptional({ trim: true }, getBannerLinkRules()),
	})

	public messages: CustomMessages = this.messages
}
