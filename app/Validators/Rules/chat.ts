// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { rules } from '@ioc:Adonis/Core/Validator'

export function getConversationIdRules(withExistsRule = false): Rule[] {
	const conversationIdRules: Rule[] = [rules.unsigned()]

	if (withExistsRule) conversationIdRules.push(rules.exists({ table: TABLES_NAMES.CONVERSATIONS, column: 'id' }))

	return conversationIdRules
}
