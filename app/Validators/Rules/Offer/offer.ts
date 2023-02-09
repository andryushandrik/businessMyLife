// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { OFFER_BLOCK_DESCRIPTION_MAX_LENGTH, TABLES_NAMES } from 'Config/database'
import { OfferCategories, OfferPaybackTimes, OfferProjectStages } from 'Config/offer'

export function getOfferIdRules(table: string = TABLES_NAMES.OFFERS): Rule[] {
	return [rules.unsigned(), rules.exists({ table, column: 'id' })]
}

export function getOfferBlockDescriptionRules(): Rule[] {
	return [rules.maxLength(OFFER_BLOCK_DESCRIPTION_MAX_LENGTH)]
}

export function getOfferCategoryRules(): Rule[] {
	return [rules.unsigned(), rules.range(OfferCategories.SEARCH_FOR_INVESTORS, OfferCategories.FRANCHISES)]
}

export function getOfferProjectStageRules(): Rule[] {
	return [rules.unsigned(), rules.range(OfferProjectStages.IDEA, OfferProjectStages.COMPLETE)]
}

export function getOfferPaybackTimeRules(): Rule[] {
	return [rules.unsigned(), rules.range(OfferPaybackTimes.DONT_DISPLAY, OfferPaybackTimes.AFTER_THREE_YEARS)]
}

export function getOfferImageOptions() {
	return {
		size: '5mb',
		extnames: ['jpg', 'jpeg', 'png', 'webp'],
	}
}
