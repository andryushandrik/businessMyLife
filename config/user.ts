// Don't change orders below
export const ROLES_NAMES = ['администратор', 'модератор'] as const
export enum RolesNames {
  ADMIN = 0,
  MODERATOR = 1,
}

// Don't change orders below
export const TYPES_NAMES = ['Физ лицо', 'ИП', 'ООО'] as const
export enum TypesNames {
  PHYSICAL_PERSON = 0,
  INDIVIDUAL_ENTREPRENEUR = 1,
  LIMITED_LIABILITY_COMPANY = 2,
}
