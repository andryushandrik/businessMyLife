// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'

export function getVerifyCodeRules(): Rule[] {
  return [
    rules.unsigned(),
    rules.range(100000, 999999),
  ]
}
