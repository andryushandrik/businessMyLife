import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import IndexValidator from "../IndexValidator";
import { getPartnersTitleRules, getPartnerVideoRules } from "../Rules/partners";
import {
  PARTNER_IMAGE_MEDIA_TYPE,
  PARTNER_VIDEO_MEDIA_TYPE,
} from "Config/database";

export default class PartnerWithVideoValidator extends IndexValidator {
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
    media: schema.string({ trim: true }, getPartnerVideoRules()),
  });

  public messages: CustomMessages = this.messages;
}
