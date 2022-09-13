import { schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  getNewsDescriptionRules,
  getNewsSlugRules,
  getNewsTitleRules,
  getNewsSuptitleRules,
  getReadingTimeRules,
} from "./Rules/news";

export default class NewsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    slug: schema.string.optional({ trim: true }, getNewsSlugRules()),
    title: schema.string({ trim: true }, getNewsTitleRules()),
    description: schema.string({ trim: true }, getNewsDescriptionRules()),

    /**
     * Optional fields
     */

    suptitle: schema.string.optional({ trim: true }, getNewsSuptitleRules()),
    image: schema.string.optional(),
    readingTimeFrom: schema.number.optional(getReadingTimeRules()),
    readingTimeTo: schema.number.optional(getReadingTimeRules()),
  });
}
