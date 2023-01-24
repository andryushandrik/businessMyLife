// * Types
import type News from 'App/Models/News'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from './IndexValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import {
	getNewsDescriptionRules,
	getNewsSlugRules,
	getNewsTitleRules,
	getNewsSuptitleRules,
	getReadingTimeRules,
	getNewsImageOptions,
} from './Rules/news'

export default class NewsValidator extends IndexValidator {
	private readonly currentNewsId: News['id'] | null = this.ctx.params.id

	constructor(protected ctx: HttpContextContract) {
		super()
	}

	public schema = schema.create({
		title: schema.string({ trim: true }, getNewsTitleRules()),
		description: schema.string({ trim: true }, getNewsDescriptionRules()),

		/**
		 * * Optional fields
		 */

		slug: schema.string.optional({ trim: true }, getNewsSlugRules(this.currentNewsId)),
		suptitle: schema.string.optional({ trim: true }, getNewsSuptitleRules()),
		image: schema.file.optional(getNewsImageOptions()),

		readingTimeFrom: schema.number.optional([
			...getReadingTimeRules(),
			rules.beforeField('readingTimeTo'),
		]),
		readingTimeTo: schema.number.optional([
			...getReadingTimeRules(),
			rules.afterField('readingTimeFrom'),
		]),
	})

	public messages: CustomMessages = this.messages
}
