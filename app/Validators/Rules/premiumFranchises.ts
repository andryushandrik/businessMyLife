import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { TABLES_NAMES } from 'Config/database'

export function getPremiumFranchisesRule(table: string = TABLES_NAMES.PREMIUM_FRANCHISES): Rule[] {
	return [rules.exists({ table, column: 'id' })]
}
