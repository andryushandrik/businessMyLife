import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { TABLES_NAMES } from 'Config/database'

export function getPremiumSlotIdRule(table: string = TABLES_NAMES.PREMIUM_SLOTS): Rule[] {
	return [rules.exists({ table, column: 'id' })]
}
