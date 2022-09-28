// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { MAIN_PAGE_VIDEO_TITLE_MAX_LENGTH } from 'Config/database'

export function getMainPageVideoTitleRules(): Rule[] {
  return [ rules.maxLength(MAIN_PAGE_VIDEO_TITLE_MAX_LENGTH) ]
}

export function getMainPageVideoDescriptionRules(): Rule[] {
  return [ rules.maxLength(MAIN_PAGE_VIDEO_TITLE_MAX_LENGTH) ]
}
