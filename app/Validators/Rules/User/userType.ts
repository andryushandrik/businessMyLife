// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { rules } from '@ioc:Adonis/Core/Validator'

export function getUserTypeIdRules(): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table: TABLES_NAMES.USERS_TYPES, column: 'id' }),
  ]
}
