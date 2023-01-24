// Don't change orders below
export const ROLE_NAMES = ['администратор', 'модератор', 'пользователь'] as const
export enum RoleNames {
	ADMIN = 0,
	MODERATOR = 1,
	USER = 2,
}

// Don't change orders below
export const USER_TYPE_NAMES = ['Физ лицо', 'ИП', 'ООО'] as const
export enum UserTypeNames {
	PHYSICAL_PERSON = 0,
	INDIVIDUAL_ENTREPRENEUR = 1,
	LIMITED_LIABILITY_COMPANY = 2,
}

// Don't change orders below
export const USER_EXPERIENCE_TYPES = [
	'до 3 месяцев',
	'от 3 до 6 месяцев',
	'от 6 месяцев до 1 года',
	'от 1 года до 3 лет',
	'от 3 лет',
] as const
export enum UserExperienceTypes {
	BEFORE_THREE_MONTH = 0,
	AFTER_THREE_MONTH = 1,
	AFTER_SIX_MONTH = 2,
	AFTER_YEAR = 3,
	AFTER_THREE_YEARS = 4,
}
