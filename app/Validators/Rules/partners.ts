import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { PARTNER_TITLE_MAX_LENGTH, PARTNER_TITLE_MIN_LENGTH, PARTNER_VIDEO_LINK_MAX_LENGTH, PARTNER_VIDEO_LINK_MIN_LENGTH } from 'Config/database'

export function getPartnersTitleRules(): Rule[] {
  return [
    rules.minLength(PARTNER_TITLE_MIN_LENGTH),
    rules.maxLength(PARTNER_TITLE_MAX_LENGTH),
  ]
}

export function getPartnerImageOptions() {
  return {
    size: '5mb',
    extnames: ['jpg', 'png', 'jpeg'],
  }
}

export function getPartnerVideoRules(): Rule[] {
  return [
    rules.minLength(PARTNER_VIDEO_LINK_MIN_LENGTH),
    rules.maxLength(PARTNER_VIDEO_LINK_MAX_LENGTH),
  ]
}
