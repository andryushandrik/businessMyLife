// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'

export function getUserBlockedUntilRules(): Rule[] {
  return [ rules.after('today') ]
}
