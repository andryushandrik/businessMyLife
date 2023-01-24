// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { getUserIdRules } from '../Rules/User/user'
import { getOfferIdRules } from '../Rules/Offer/offer'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { REPORT_DESCRIPTION_LENGTH, TABLES_NAMES } from 'Config/database'

export default class ReportValidator extends IndexValidator {
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
		description: schema.string({ trim: true }, [rules.maxLength(REPORT_DESCRIPTION_LENGTH)]),

		userId: schema.number(getUserIdRules()),
		reportTypeId: schema.number([
			rules.unsigned(),
			rules.exists({ table: TABLES_NAMES.REPORT_TYPES, column: 'id' }),
		]),

		/**
		 * * Optional fields
		 */

		toId: schema.number.optional([...getUserIdRules(), rules.requiredIfNotExists('offerId')]),
		offerId: schema.number.optional([...getOfferIdRules(), rules.requiredIfNotExists('toId')]),
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
