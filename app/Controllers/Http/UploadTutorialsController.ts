// * Types
import type UploadTutorial from 'App/Models/UploadTutorial'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import UploadTutorialService from 'App/Services/UploadTutorialService'
import UploadTutorialValidator from 'App/Validators/UploadTutorialValidator'
import { ResponseMessages } from 'Config/response'

export default class UploadTutorialsController {
  public async index({ request, response, route, view, session }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const tutorials: ModelPaginatorContract<UploadTutorial> = await UploadTutorialService.paginate({ page, baseUrl })

      return view.render('pages/uploadTutorials/index', { tutorials })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/uploadTutorials/create')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(UploadTutorialValidator)

    try {
      await UploadTutorialService.create(payload)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().toRoute('upload_tutorials.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async show({ view, params, session, response }: HttpContextContract) {
    const id: UploadTutorial['id'] = params.id

    try {
      const item: UploadTutorial = await UploadTutorialService.get(id)

      return view.render('pages/uploadTutorials/show', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ view, params, session, response }: HttpContextContract) {
    const id: UploadTutorial['id'] = params.id

    try {
      const item: UploadTutorial = await UploadTutorialService.get(id)

      return view.render('pages/uploadTutorials/edit', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ params, request, session, response }: HttpContextContract) {
    const id: UploadTutorial['id'] = params.id
    let payload = await request.validate(UploadTutorialValidator)

    try {
      await UploadTutorialService.update(id, payload)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().toRoute('upload_tutorials.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const id: UploadTutorial['id'] = params.id

    try {
      await UploadTutorialService.delete(id)
      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().back()
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }
}
