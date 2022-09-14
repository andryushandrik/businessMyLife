import { Rule, rules } from '@ioc:Adonis/Core/Validator'
import News from 'App/Models/News'
import { NEWS_DESCRIPTION_MAX_LENGTH, NEWS_TITLE_MAX_LENGTH, NEWS_SLUG_MAX_LENGTH, NEWS_SUPTITLE_MAX_LENGTH } from 'Config/database'
import { TABLES_NAMES } from 'Config/database'

export function getNewsSlugRules(id: News['id'] | null): Rule[] {
	const newsRules: Rule[] = [
		rules.minLength(4),
    rules.maxLength(NEWS_SLUG_MAX_LENGTH),
	]

	if (id)
		newsRules.push(rules.unique({
			table: TABLES_NAMES.NEWS, 
			column: "slug",
			whereNot: { id },
	}))

  return newsRules
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

export function getNewsImageOptions(){
    return {
        size: '3mb',
        extnames: ['jpg', 'png', 'jpeg'],
      }
}
