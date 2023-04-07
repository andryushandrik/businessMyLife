// * Types
import { CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getPartnersTitleRules } from '../Rules/partners'
import { getUploadTutorialEmbedRules, getUploadTutorialVideoOptions } from '../Rules/uploadTutorial'

export default class PartnerWithVideoValidator extends IndexValidator {
	private readonly isUpdating: boolean = this.ctx.request.method() === 'PATCH'
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		title: schema.string({ trim: true }, getPartnersTitleRules()),
		// media: schema.string({ trim: true }, getPartnerVideoRules()),
		mediaType: schema.boolean(),

		media: this.isUpdating
			? schema.file.optional(getUploadTutorialVideoOptions(), [rules.requiredIfNotExists('embed')])
			: schema.file(getUploadTutorialVideoOptions(), [rules.requiredIfNotExists('embed')]),
		/**
		 * * Optional fields
		 */
		embed: schema.string.optional({ trim: true }, [...getUploadTutorialEmbedRules(), rules.requiredIfNotExists('media')]),
		link: schema.string.optional(),
		isVisible: schema.boolean.optional(),
		isTitleLink: schema.boolean.optional(),
	})

	public messages: CustomMessages = this.messages
}

