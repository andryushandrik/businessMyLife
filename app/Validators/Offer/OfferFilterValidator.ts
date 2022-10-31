// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from '../ApiValidator'
import { getAreaIdRules } from '../Rules/Offer/area'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { getSubsectionIdRules } from '../Rules/Offer/subsection'
import { getOfferCategoryRules, getOfferPaybackTimeRules, getOfferProjectStageRules } from '../Rules/Offer/offer'

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
    random: schema.boolean.optional(),

    /**
     * * Optional fields
     */

    city: schema.string.optional({ trim: true }),
    query: schema.string.optional({ trim: true }),
    areaId: schema.number.optional(getAreaIdRules()),
    category: schema.number.optional(getOfferCategoryRules()),
    subsectionId: schema.number.optional(getSubsectionIdRules()),
    investmentsTo: schema.number.optional([ rules.unsigned() ]),
    investmentsFrom: schema.number.optional([ rules.unsigned() ]),
    paybackTime: schema.number.optional(getOfferPaybackTimeRules()),
    projectStage: schema.number.optional(getOfferProjectStageRules()),
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
