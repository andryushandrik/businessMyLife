// * Types
import type User from 'App/Models/User/User'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { UserTypeNames } from 'Config/user'
import { rules } from '@ioc:Adonis/Core/Validator'
import {
  TABLES_NAMES, USER_COMPANY_NAME_MAX_LENGTH, USER_COMPANY_NAME_MIN_LENGTH,
  USER_FIRST_NAME_MAX_LENGTH, USER_FIRST_NAME_MIN_LENGTH, USER_LAST_NAME_MAX_LENGTH,
  USER_LAST_NAME_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH,
  USER_PATRONYMIC_MAX_LENGTH, USER_PATRONYMIC_MIN_LENGTH,
} from 'Config/database'

export function getUserIdRules(table: string = TABLES_NAMES.USERS): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}

export function getUserBlockedUntilRules(): Rule[] {
  return [ rules.after('today') ]
}

export function getUserEmailRules(withUniqueOrExists: 'unique' | 'exists' | false = false, currentUserId: User['id'] | null = null, table: string = TABLES_NAMES.USERS): Rule[] {
  const rulesArr: Rule[] = [ rules.email() ]

  if (withUniqueOrExists == 'unique')
    rulesArr.push(rules.unique({ table, column: 'email', whereNot: { id: currentUserId } }))
  else if (withUniqueOrExists == 'exists')
    rulesArr.push(rules.exists({ table, column: 'email' }))

  return rulesArr
}

export function getUserPasswordRules(isWithConfirm: boolean = false): Rule[] {
  const rulesArr: Rule[] = [
    rules.containNumber(),
    rules.containUppercase(),
    rules.minLength(USER_PASSWORD_MIN_LENGTH),
    rules.maxLength(USER_PASSWORD_MAX_LENGTH),
  ]

  if (isWithConfirm)
    rulesArr.push(rules.confirmed('passwordConfirm'))

  return rulesArr
}

export function getUserCompanyNameRules(typeFieldName: string): Rule[] {
  return [
    rules.minLength(USER_COMPANY_NAME_MIN_LENGTH),
    rules.maxLength(USER_COMPANY_NAME_MAX_LENGTH),
    rules.requiredWhen(typeFieldName, 'in', [`${UserTypeNames.INDIVIDUAL_ENTREPRENEUR}`, `${UserTypeNames.LIMITED_LIABILITY_COMPANY}`]),
  ]
}

export function getUserFirstNameRules(): Rule[] {
  return [
    rules.minLength(USER_FIRST_NAME_MIN_LENGTH),
    rules.maxLength(USER_FIRST_NAME_MAX_LENGTH),
  ]
}

export function getUserLastNameRules(): Rule[] {
  return [
    rules.minLength(USER_LAST_NAME_MIN_LENGTH),
    rules.maxLength(USER_LAST_NAME_MAX_LENGTH),
  ]
}

export function getUserPatronymicRules(): Rule[] {
  return [
    rules.minLength(USER_PATRONYMIC_MIN_LENGTH),
    rules.maxLength(USER_PATRONYMIC_MAX_LENGTH),
  ]
}

export function getUserTypeRules(): Rule[] {
  return [
    rules.unsigned(),
    rules.range(UserTypeNames.PHYSICAL_PERSON, UserTypeNames.LIMITED_LIABILITY_COMPANY),
  ]
}
