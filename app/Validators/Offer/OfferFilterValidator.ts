// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from '../ApiValidator'
import { getAreaIdRules } from '../Rules/Offer/area'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { getOfferCategoryRules } from '../Rules/Offer/offer'
import { OfferPaybackTimes, OfferProjectStages } from 'Config/offer'

export default class OfferFilterValidator extends ApiValidator {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
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

    city: schema.string.optional({ trim: true }),
    query: schema.string.optional({ trim: true }),
    areaId: schema.number.optional(getAreaIdRules()),
    category: schema.number.optional(getOfferCategoryRules()),
    subsectionId: schema.number.optional([ rules.unsigned() ]),
    investmentsTo: schema.number.optional([ rules.unsigned() ]),
    investmentsFrom: schema.number.optional([ rules.unsigned() ]),
    projectStage: schema.number.optional([
      rules.unsigned(),
      rules.range(OfferProjectStages.IDEA, OfferProjectStages.COMPLETE),
    ]),
    paybackTime: schema.number.optional([
      rules.unsigned(),
      rules.range(OfferPaybackTimes.BEFORE_THREE_MONTH, OfferPaybackTimes.AFTER_THREE_YEARS),
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
