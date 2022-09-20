// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from './IndexValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class ApiValidator extends IndexValidator {

  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    page: schema.number([rules.unsigned()]),

    /**
     * Optional fields
     */

    limit: schema.number.optional([rules.unsigned()]),
    orderBy: schema.enum.optional(['asc', 'desc'] as const),
    orderByColumn: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = this.messages
}