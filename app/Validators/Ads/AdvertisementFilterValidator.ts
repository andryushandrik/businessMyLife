// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from '../ApiValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getSubsectionIdRules } from '../Rules/Offer/subsection'
import { getUserIdRules } from '../Rules/User/user'

export default class AdvertisementFilterValidator extends ApiValidator {
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
		...this.fields,

		/**
		 * * Optional fields
		 */
     isArchived: schema.boolean.optional(),
		isVerified: schema.boolean.optional(),
		place: schema.string.optional({ trim: true }),
		subsectionId: schema.number.optional(getSubsectionIdRules()),
		userId: schema.number.optional(getUserIdRules()),
		query: schema.string.optional({ trim: true }),

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
