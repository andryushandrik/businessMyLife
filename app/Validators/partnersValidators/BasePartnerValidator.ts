import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndexValidator from '../IndexValidator'
import { getPartnersTitleRules } from '../Rules/partners'

export default class BasePartnerValidator extends IndexValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    title: schema.string({trim: true}, getPartnersTitleRules()),
    isTitleLink: schema.boolean(),
    mediaType: schema.enum([0, 1] as const)
  })

  public messages: CustomMessages = this.messages
}
