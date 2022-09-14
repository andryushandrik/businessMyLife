import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndexValidator from './IndexValidator'
import { getFeedbackNameRules, getFeedbackEmailRules, getFeedbackQuestionRules } from './Rules/feedback'

export default class FeedbackValidator extends IndexValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    isCompleted: schema.boolean(),
    name: schema.string({trim: true}, getFeedbackNameRules()),
    email: schema.string({trim: true}, getFeedbackEmailRules()),
    question: schema.string({trim: true}, getFeedbackQuestionRules())
  })

  public messages: CustomMessages = this.messages;
}
