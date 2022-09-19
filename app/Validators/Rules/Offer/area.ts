// * Types
import type Area from 'App/Models/Offer/Area'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { AREA_NAME_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export function getAreaIdRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getAreaNameRules(id: Area['id'] | null = null): Rule[] {
  return [
    rules.maxLength(AREA_NAME_MAX_LENGTH),
    rules.unique({ table: TABLES_NAMES.AREAS, column: 'name', whereNot: { id } }),
  ]
}
