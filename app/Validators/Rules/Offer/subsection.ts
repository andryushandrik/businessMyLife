import Area from 'App/Models/Offer/Area'
// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { SUBSECTION_NAME_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export function getSubsectionIdRules(table: string = TABLES_NAMES.SUBSECTIONS): Rule[] {
	return [rules.unsigned(), rules.exists({ table, column: 'id' })]
}

export function getSubsectionNameRules(areaId: Area['id'] | null = null): Rule[] {
	return [rules.maxLength(SUBSECTION_NAME_MAX_LENGTH), rules.unique({ table: TABLES_NAMES.SUBSECTIONS, column: 'name', where: { area_id: areaId } })]
}
