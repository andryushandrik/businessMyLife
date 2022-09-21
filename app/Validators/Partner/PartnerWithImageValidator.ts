import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndexValidator from '../IndexValidator'
import {
  getPartnersTitleRules,
  getPartnerImageOptions,
} from '../Rules/partners'

export default class PartnerWithImageValidator extends IndexValidator {
  private readonly isUpdating: boolean = this.ctx.request.method() === 'PATCH'

  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, getPartnersTitleRules()),
    isTitleLink: schema.boolean.optional(),
    mediaType: schema.boolean(),
    media: this.isUpdating ? schema.file.optional(getPartnerImageOptions()) : schema.file(getPartnerImageOptions()),
  })

  public messages: CustomMessages = this.messages
}
