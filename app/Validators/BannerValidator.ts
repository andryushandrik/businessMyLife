import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndexValidator from './IndexValidator'
import { getBannerDescriptionRules, getBannerTitleRules, getBannerFileOptions } from './Rules/banner'

export default class BannerValidator extends IndexValidator {
  private readonly isUpdating: boolean = this.ctx.request.method() === "PATCH" ? true : false

  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    image: this.isUpdating ? schema.file.optional(getBannerFileOptions()) : schema.file(getBannerFileOptions()),
    title: schema.string(getBannerTitleRules()),
    description: schema.string(getBannerDescriptionRules())
  })

  public messages: CustomMessages = this.messages
}
