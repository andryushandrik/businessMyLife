import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BasePartnerValidator from '../IndexValidator'
import { getPartnerVideoRules } from '../Rules/partners'

export default class PartnerWithVideoValidator extends BasePartnerValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    media: schema.string({trim: true}, getPartnerVideoRules())
  })

  public messages: CustomMessages = this.messages
}
