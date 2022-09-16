import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BasePartnerValidator from '../IndexValidator'
import { getPartnerImageOptions } from '../Rules/partners'

export default class PartnerWithImageValidator extends BasePartnerValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    media: schema.file(getPartnerImageOptions())
  })

  public messages: CustomMessages = this.messages
}
