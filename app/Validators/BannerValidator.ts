// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from './IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getBannerDescriptionRules, getBannerTitleRules, getBannerFileOptions } from './Rules/banner'

export default class BannerValidator extends IndexValidator {
  private readonly isUpdating: boolean = this.ctx.request.method() === 'PATCH'

  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, getBannerTitleRules()),
    description: schema.string({ trim: true }, getBannerDescriptionRules()),
    image: this.isUpdating ? schema.file.optional(getBannerFileOptions()) : schema.file(getBannerFileOptions()),
  })

  public messages: CustomMessages = this.messages
}
