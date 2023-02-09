// * Types
import type Area from 'App/Models/Offer/Area'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { AREA_NAME_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

const TABLE: string = TABLES_NAMES.AREAS

export function getAreaIdRules(withExistsRule = false): Rule[] {
	const areaRules: Rule[] = [rules.unsigned()]

	if (withExistsRule) areaRules.push(rules.exists({ table: TABLE, column: 'id' }))

	return areaRules
}

export function getAreaNameRules(id: Area['id'] | null = null): Rule[] {
	return [rules.maxLength(AREA_NAME_MAX_LENGTH), rules.unique({ table: TABLE, column: 'name', whereNot: { id } })]
}
