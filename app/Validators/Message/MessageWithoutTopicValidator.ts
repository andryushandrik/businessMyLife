// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
// * Types

import IndexValidator from '../IndexValidator'
import { MESSAGE_TEXT_MAX_LENGTH } from 'Config/database'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class MessageWithoutTopicValidator extends IndexValidator {
  protected preParsedSchema = {
    text: schema.string({ trim: true }, [ rules.maxLength(MESSAGE_TEXT_MAX_LENGTH) ]),
    conversationId: schema.number([ rules.unsigned() ]),
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
