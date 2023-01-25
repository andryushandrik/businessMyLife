// Don't change orders below
export const OFFER_CATEGORIES = [
	'поиск инвесторов',
	'предложения инвесторов',
	'поиск бизнес партнеров',
	'продажа готового бизнеса',
	'франшизы',
] as const
export enum OfferCategories {
	SEARCH_FOR_INVESTORS = 0,
	INVESTOR_PROPOSALS = 1,
	SEARCH_FOR_BUSINESS_PARTNERS = 2,
	COMPLETE_BUSINESS_SELL = 3,
	FRANCHISES = 4,
}

// Don't change orders below
export const OFFER_PAYBACK_TIMES = [
	'',
	'до 3 месяцев',
	'от 3 до 6 месяцев',
	'от 6 месяцев до 1 года',
	'от 1 года до 3 лет',
	'от 3 лет',
] as const
export enum OfferPaybackTimes {
	DONT_DISPLAY = 0,
	BEFORE_THREE_MONTH = 1,
	AFTER_THREE_MONTH = 2,
	AFTER_SIX_MONTH = 3,
	AFTER_YEAR = 4,
	AFTER_THREE_YEARS = 5,
}

// Don't change orders below
export const OFFER_PROJECT_STAGES = ['Идея', 'В стадии создания', 'Готовый бизнес'] as const
export enum OfferProjectStages {
	IDEA = 0,
	CREATING = 1,
	COMPLETE = 2,
}
