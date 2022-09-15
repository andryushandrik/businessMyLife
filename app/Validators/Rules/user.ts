// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from 'Config/database'

export function getUserBlockedUntilRules(): Rule[] {
  return [ rules.after('today') ]
}

export function getUserEmailRules(): Rule[] {
  return [ rules.email() ]
}

export function getUserPasswordRules(): Rule[] {
  return [
    rules.containNumber(),
    rules.containUppercase(),
    rules.minLength(USER_PASSWORD_MIN_LENGTH),
    rules.maxLength(USER_PASSWORD_MAX_LENGTH),
  ]
}
