import { schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  getNewsDescriptionRules,
  getNewsSlugRules,
  getNewsTitleRules,
  getNewsSuptitleRules,
  getReadingTimeRules,
  getNewsImageOptions,
} from "./Rules/news";
import type { CustomMessages } from "@ioc:Adonis/Core/Validator";
import IndexValidator from "./IndexValidator";
import News from "App/Models/News";

export default class NewsValidator extends IndexValidator {
  private readonly currentNewsId: News["id"] | null = this.ctx.params.id;

  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, getNewsTitleRules()),
    description: schema.string({ trim: true }, getNewsDescriptionRules()),

    /**
     * Optional fields
     */

    slug: schema.string.optional(
      { trim: true },
      getNewsSlugRules(this.currentNewsId)
    ),
    suptitle: schema.string.optional({ trim: true }, getNewsSuptitleRules()),
    image: schema.file.optional(getNewsImageOptions()),
    readingTimeFrom: schema.number.optional(getReadingTimeRules()),
    readingTimeTo: schema.number.optional(getReadingTimeRules()),
  });

  public messages: CustomMessages = this.messages;
}
