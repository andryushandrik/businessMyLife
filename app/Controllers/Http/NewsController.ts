// * Types
import type News from 'App/Models/News'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import NewsService from 'App/Services/NewsService'
import NewsValidator from 'App/Validators/NewsValidator'
import { ResponseMessages } from 'Config/response'

export default class NewsController {
  public async index({ request, response, route, view, session }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const news: ModelPaginatorContract<News> = await NewsService.paginate({ page, baseUrl })

      return view.render('pages/news/index', { news })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/news/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(NewsValidator)

    try {
      await NewsService.create(payload)

      session.flash('success', ResponseMessages.SUCCESS)
      response.redirect().toRoute('news.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      response.redirect().back()
    }
  }

  public async show({view, response, session, params}: HttpContextContract){
    const id: News['id'] = params.id

    try {
      const item: News = await NewsService.get(id)

      return view.render('pages/news/show', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ view, response, params, session }: HttpContextContract) {
    const id: News['id'] = params.id

    try {
      const item: News = await NewsService.get(id)

      return view.render('pages/news/edit', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    const id: News['id'] = params.id
    const payload = await request.validate(NewsValidator)

    try {
      await NewsService.update(id, payload)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().toRoute('news.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ response, session, params }: HttpContextContract) {
    const id: News['id'] = params.id

    try {
      await NewsService.delete(id)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    response.redirect().back()
  }
}
