// * Types
import type News from 'App/Models/News'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { rules } from '@ioc:Adonis/Core/Validator'
import {
	NEWS_DESCRIPTION_MAX_LENGTH,
	NEWS_TITLE_MAX_LENGTH,
	NEWS_SUPTITLE_MAX_LENGTH,
	NEWS_TITLE_MIN_LENGTH,
	NEWS_DESCRIPTION_MIN_LENGTH,
	NEWS_SUPTITLE_MIN_LENGTH,
} from 'Config/database'

export function getNewsSlugRules(id: News['id'] | null): Rule[] {
	return [rules.unique({ table: TABLES_NAMES.NEWS, column: 'slug', whereNot: { id } })]
}

export function getNewsTitleRules(): Rule[] {
	return [rules.minLength(NEWS_TITLE_MIN_LENGTH), rules.maxLength(NEWS_TITLE_MAX_LENGTH)]
}

export function getNewsDescriptionRules(): Rule[] {
	return [
		rules.minLength(NEWS_DESCRIPTION_MIN_LENGTH),
		rules.maxLength(NEWS_DESCRIPTION_MAX_LENGTH),
	]
}

export function getNewsSuptitleRules(): Rule[] {
	return [rules.minLength(NEWS_SUPTITLE_MIN_LENGTH), rules.maxLength(NEWS_SUPTITLE_MAX_LENGTH)]
}

export function getReadingTimeRules(): Rule[] {
	return [rules.unsigned()]
}

export function getNewsImageOptions() {
	return {
		size: '3mb',
		extnames: ['jpg', 'png', 'jpeg'],
	}
}
