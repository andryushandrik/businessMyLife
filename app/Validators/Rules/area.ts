// * Types
import type Area from 'App/Models/Area'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { AREA_NAME_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export function getAreaNameRules(id?: Area['id']): Rule[] {
  const defaultRules: Rule[] = [ rules.maxLength(AREA_NAME_MAX_LENGTH) ]

  if (id)
    defaultRules.push(rules.unique({ table: TABLES_NAMES.AREAS, column: 'name', whereNot: { id } }))

  return defaultRules
}
