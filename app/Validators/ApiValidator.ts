// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
// * Types

import IndexValidator from './IndexValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ApiValidator extends IndexValidator {
  protected readonly fields = {
    page: schema.number([ rules.unsigned() ]),

    /**
     * * Optional fields
     */

    limit: schema.number.optional([ rules.unsigned() ]),
    orderBy: schema.enum.optional(['asc', 'desc'] as const),
    orderByColumn: schema.string.optional({ trim: true }),
  }

  constructor() {
    super()
  }

  public schema = schema.create(this.fields)

  public messages: CustomMessages = this.messages
}
