import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import IndexValidator from "../IndexValidator";
import {
  getPartnersTitleRules,
  getPartnerImageOptions,
} from "../Rules/partners";
import {
  PARTNER_IMAGE_MEDIA_TYPE,
  PARTNER_VIDEO_MEDIA_TYPE,
} from "Config/database";

export default class PartnerWithImageValidator extends IndexValidator {
  private readonly isUpdating =
    this.ctx.request.method() === "PATCH" ? true : false;
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, getPartnersTitleRules()),
    isTitleLink: schema.boolean(),
    mediaType: schema.enum.optional([
      PARTNER_IMAGE_MEDIA_TYPE,
      PARTNER_VIDEO_MEDIA_TYPE,
    ] as const),
    media: this.isUpdating
      ? schema.file.optional(getPartnerImageOptions())
      : schema.file(getPartnerImageOptions()),
  });

  public messages: CustomMessages = this.messages;
}
