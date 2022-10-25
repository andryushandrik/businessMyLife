// * Types
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../../IndexValidator'
import { getVerifyCodeRules } from '../../Rules/auth'
import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { getUserCompanyNameRules, getUserEmailRules, getUserFirstNameRules, getUserLastNameRules, getUserPasswordRules, getUserPatronymicRules } from '../../Rules/User/user'
import { getUserTypeIdRules } from 'App/Validators/Rules/User/userType'

export default class RegisterValidator extends IndexValidator {
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
    verifyCode: schema.number(getVerifyCodeRules()),

    firstName: schema.string({ trim: true }, getUserFirstNameRules()),
    lastName: schema.string({ trim: true }, getUserLastNameRules()),
    patronymic: schema.string({ trim: true }, getUserPatronymicRules()),

    password: schema.string({ trim: true }, getUserPasswordRules(true)),
    email: schema.string({ trim: true }, getUserEmailRules('unique')),

    typeId: schema.number(getUserTypeIdRules()),

    /**
     * * Optional fields
     */

    companyName: schema.string.optional({ trim: true }, getUserCompanyNameRules()),
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
