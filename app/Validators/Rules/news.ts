import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import { NEWS_DESCRIPTION_MAX_LENGTH, NEWS_TITLE_MAX_LENGTH, NEWS_SLUG_MAX_LENGTH, NEWS_SUPTITLE_MAX_LENGTH } from 'Config/database'

export function getNewsSlugRules(): Rule[] {
  return [
    rules.minLength(4),
    rules.maxLength(NEWS_SLUG_MAX_LENGTH),
  ]
}

export function getNewsTitleRules(): Rule[] {
    return [
        rules.minLength(4),
        rules.maxLength(NEWS_TITLE_MAX_LENGTH),
    ]
}

export function getNewsDescriptionRules(): Rule[] {
    return [
        rules.minLength(10),
        rules.maxLength(NEWS_DESCRIPTION_MAX_LENGTH)
    ]
}

export function getNewsSuptitleRules(): Rule[] {
    return [
        rules.minLength(10),
        rules.maxLength(NEWS_SUPTITLE_MAX_LENGTH)
    ]
}

export function getReadingTimeRules(): Rule[] {
    return [
        rules.unsigned(),
        rules.range(1, 1000)
    ]
}
