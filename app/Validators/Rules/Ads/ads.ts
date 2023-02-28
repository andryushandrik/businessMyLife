// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { ADVERTISEMENT_DESCRIPTION_MAX_LENGTH, ADVERTISEMENT_DESCRIPTION_MIN_LENGTH, TABLES_NAMES } from 'Config/database'

export function getAdsDescriptionRules(): Rule[] {
	return [rules.minLength(ADVERTISEMENT_DESCRIPTION_MIN_LENGTH), rules.maxLength(ADVERTISEMENT_DESCRIPTION_MAX_LENGTH)]
}

export function getAdsFileOptions() {
	return {
		size: '5mb',
		extnames: ['jpeg', 'png', 'jpg'],
	}
}
export function getAdvertisementPlacedUntilValidator(): Rule[] {
	return [rules.after('today')]
}

export function getAdvertisementTypesRules(): Rule[] {
	return [rules.exists({ table: TABLES_NAMES.ADS_TYPES, column: 'id' })]
}
