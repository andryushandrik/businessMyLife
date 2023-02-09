// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { BANNER_DESCRIPTION_MAX_LENGTH, BANNER_DESCRIPTION_MIN_LENGTH, BANNER_TITLE_MAX_LENGTH, BANNER_TITLE_MIN_LENGTH } from 'Config/database'

export function getBannerTitleRules(): Rule[] {
	return [rules.minLength(BANNER_TITLE_MIN_LENGTH), rules.maxLength(BANNER_TITLE_MAX_LENGTH)]
}

export function getBannerDescriptionRules(): Rule[] {
	return [rules.minLength(BANNER_DESCRIPTION_MIN_LENGTH), rules.maxLength(BANNER_DESCRIPTION_MAX_LENGTH)]
}

export function getBannerLinkRules(): Rule[] {
	return [
		rules.url({
			protocols: ['http', 'https'],
			requireProtocol: true,
		}),
	]
}

export function getBannerFileOptions() {
	return {
		size: '5mb',
		extnames: ['jpeg', 'png', 'jpg'],
	}
}
