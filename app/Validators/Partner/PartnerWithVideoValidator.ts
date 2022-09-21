import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndexValidator from '../IndexValidator'
import { getPartnersTitleRules, getPartnerVideoRules } from '../Rules/partners'

export default class PartnerWithVideoValidator extends IndexValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, getPartnersTitleRules()),
    isTitleLink: schema.boolean.optional(),
    mediaType: schema.boolean(),
    media: schema.string({ trim: true }, getPartnerVideoRules()),
  })

  public messages: CustomMessages = this.messages
}
