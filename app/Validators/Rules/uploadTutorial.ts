// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { MAX_LIMIT } from 'Config/bodyparser'
import {
  UPLOAD_TUTORIAL_TITLE_MAX_LENGTH, UPLOAD_TUTORIAL_TITLE_MIN_LENGTH,
  UPLOAD_TUTORIAL_VIDEO_LINK_MAX_LENGTH, UPLOAD_TUTORIAL_VIDEO_LINK_MIN_LENGTH,
} from 'Config/database'

export function getUploadTutorialTitleRules(): Rule[] {
  return [
    rules.minLength(UPLOAD_TUTORIAL_TITLE_MIN_LENGTH),
    rules.maxLength(UPLOAD_TUTORIAL_TITLE_MAX_LENGTH),
  ]
}

export function getUploadTutorialEmbedRules(): Rule[] {
  return [
    rules.minLength(UPLOAD_TUTORIAL_VIDEO_LINK_MIN_LENGTH),
    rules.maxLength(UPLOAD_TUTORIAL_VIDEO_LINK_MAX_LENGTH),
  ]
}

export function getUploadTutorialVideoOptions() {
  return {
    size: `${MAX_LIMIT}mb`,
    extnames: ['avi', 'mp4', 'mov'],
  }
}
