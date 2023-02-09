// * Types
import type User from 'App/Models/User/User'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { UserTypeNames } from 'Config/user'
import { TABLES_NAMES } from 'Config/database'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { getUserTypeRules } from '../Rules/User/user'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { getUserFirstNameRules, getUserLastNameRules, getUserPatronymicRules, getUserCompanyNameRules } from '../Rules/User/user'

export default class UserValidator extends IndexValidator {
	private readonly currentUserId: User['id'] | null = this.ctx.params.id ?? null

	constructor(protected ctx: HttpContextContract) {
		super()
	}

	/**
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		isShowEmail: schema.boolean(),
		isShowPhone: schema.boolean(),

		type: schema.number(getUserTypeRules()),

		firstName: schema.string({ trim: true }, getUserFirstNameRules()),
		lastName: schema.string({ trim: true }, getUserLastNameRules()),

		phone: schema.string({ trim: true }, [
			rules.mobile({ strict: true }),
			rules.unique({
				table: TABLES_NAMES.USERS,
				column: 'phone',
				whereNot: { id: this.currentUserId },
			}),
		]),
		city: schema.string.optional({ trim: true }, [rules.minLength(2)]),

		/**
		 * * Optional fields
		 */

		patronymic: schema.string.optional({ trim: true }, getUserPatronymicRules()),
		avatar: schema.file.optional({
			size: '1mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
		legalAddress: schema.string.optional({ trim: true }),
		birthday: schema.date.optional({ format: GLOBAL_DATETIME_FORMAT }),
		companyName: schema.string.optional({ trim: true }, getUserCompanyNameRules('type')),

		mainStateRegistrationNumber: schema.number.optional([
			rules.requiredWhen('type', 'in', [`${UserTypeNames.INDIVIDUAL_ENTREPRENEUR}`, `${UserTypeNames.LIMITED_LIABILITY_COMPANY}`]),
			rules.unique({
				table: TABLES_NAMES.USERS,
				column: 'mainStateRegistrationNumber',
				whereNot: { id: this.currentUserId },
			}),
		]),
		taxpayerIdentificationNumber: schema.number.optional([
			rules.requiredWhen('type', 'in', [`${UserTypeNames.INDIVIDUAL_ENTREPRENEUR}`, `${UserTypeNames.LIMITED_LIABILITY_COMPANY}`]),
			rules.unique({
				table: TABLES_NAMES.USERS,
				column: 'taxpayerIdentificationNumber',
				whereNot: { id: this.currentUserId },
			}),
		]),
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages: CustomMessages = this.messages
}
