// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { getUserEmailRules, getUserFirstNameRules } from '../Rules/User/user'
import { FEEDBACK_QUESTION_MAX_LENGTH, FEEDBACK_QUESTION_MIN_LENGTH } from 'Config/database'

export default class FeedbackValidator extends IndexValidator {
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
		name: schema.string({ trim: true }, getUserFirstNameRules()),
		email: schema.string({ trim: true }, getUserEmailRules()),
		question: schema.string({ trim: true }, [
			rules.minLength(FEEDBACK_QUESTION_MIN_LENGTH),
			rules.maxLength(FEEDBACK_QUESTION_MAX_LENGTH),
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
