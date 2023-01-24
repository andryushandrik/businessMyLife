// * Types
import type User from 'App/Models/User/User'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { RoleNames } from 'Config/user'
import { TABLES_NAMES } from 'Config/database'
import { rules } from '@ioc:Adonis/Core/Validator'

type IdRulesOptions = {
	isWithoutAdmin?: boolean
	currentRoleId?: User['id'] | null
	withUniqueOrExists?: 'unique' | 'exists' | false
}

export function getRoleIdRules(
	options?: IdRulesOptions,
	table: string = TABLES_NAMES.ROLES,
): Rule[] {
	const defaultOptions: IdRulesOptions = {
		isWithoutAdmin: options?.isWithoutAdmin ?? false,
		currentRoleId: options?.currentRoleId ?? null,
		withUniqueOrExists: options?.withUniqueOrExists ?? false,
	}
	const rulesArr: Rule[] = [rules.unsigned()]

	if (defaultOptions.withUniqueOrExists === 'unique')
		rulesArr.push(
			rules.unique({ table, column: 'id', whereNot: { id: defaultOptions.currentRoleId } }),
		)
	else if (defaultOptions.withUniqueOrExists === 'exists')
		rulesArr.push(rules.exists({ table, column: 'id' }))

	if (defaultOptions.isWithoutAdmin) rulesArr.push(rules.notIn([RoleNames.ADMIN + 1]))

	return rulesArr
}
