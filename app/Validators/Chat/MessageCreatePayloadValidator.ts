// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules, schema } from '@ioc:Adonis/Core/Validator'
import IndexValidator from 'App/Validators/IndexValidator'
import { MESSAGE_TEXT_MAX_LENGTH } from 'Config/database'
import { getConversationIdRules } from '../Rules/chat'
import { getOfferIdRules } from '../Rules/Offer/offer'
import { getUserIdRules } from '../Rules/User/user'


export default class MessageCreatePayloadValidator extends IndexValidator {
	protected preParsedSchema = {
		text: schema.string({ trim: true }, [rules.maxLength(MESSAGE_TEXT_MAX_LENGTH)]),
		conversationId: schema.number.optional([
			...getConversationIdRules(true),
			rules.requiredIfNotExists('userId'),
		]),
		userId: schema.number.optional([
			...getUserIdRules(),
			rules.requiredIfNotExists('conversationId'),
		]), //userId for receiver
		offerId: schema.number.optional(getOfferIdRules()),
	}

	constructor() {
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
	public schema = schema.create(this.preParsedSchema)

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
