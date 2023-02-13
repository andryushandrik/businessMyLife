import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { TABLES_NAMES } from 'Config/database'

export function getPromoCodeIdRules(table: string = TABLES_NAMES.PROMO_CODES): Rule[] {
	return [rules.unsigned(), rules.exists({ table, column: 'id' })]
}
