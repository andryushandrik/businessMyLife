// * Types
import type Subsection from 'App/Models/Offer/Subsection'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { SUBSECTION_NAME_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export function getSubsectionNameRules(id: Subsection['id'] | null = null): Rule[] {
  return [
    rules.maxLength(SUBSECTION_NAME_MAX_LENGTH),
    rules.unique({ table: TABLES_NAMES.SUBSECTIONS, column: 'name', whereNot: { id } }),
  ]
}
