// * Types
import type Feedback from 'App/Models/Feedback'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import FeedbackService from 'App/Services/FeedbackService'
import { ResponseMessages } from 'Config/response'

export default class FeedbacksController{
  public async paginate({ view, response, request, session, route }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const feedbacks: ModelPaginatorContract<Feedback> = await FeedbackService.paginate({ page, baseUrl }, 'asc')

      return view.render('pages/feedback/paginate', { feedbacks })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async get({ view, session, params, response }: HttpContextContract) {
    const id: Feedback['id'] = params.id

    try {
      const item: Feedback = await FeedbackService.get(id)

      return await view.render('pages/feedback/get', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async complete({ session, params, response }: HttpContextContract) {
    const id: Feedback['id'] = params.id

    try {
      await FeedbackService.markAsCompleted(id)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().toRoute('feedback.paginate')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }

  }

  public async delete({params, response, session}: HttpContextContract){
    const id: Feedback['id'] = params.id

    try {
      await FeedbackService.delete(id)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
