// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { OFFER_BLOCK_DESCRIPTION_MAX_LENGTH } from 'Config/database'

export function getOfferBlockDescriptionRules(): Rule[] {
  return [ rules.maxLength(OFFER_BLOCK_DESCRIPTION_MAX_LENGTH) ]
}
