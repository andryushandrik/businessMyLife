// * Types
import type Area from 'App/Models/Offer/Area'
import type Subsection from 'App/Models/Offer/Subsection'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import SubsectionService from 'App/Services/Offer/SubsectionService'
import SubsectionValidator from 'App/Validators/Offer/SubsectionValidator'
import { ResponseMessages } from 'Config/response'

export default class SubsectionsController {
  public async index({ request, response, route, view, session }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const subsections: ModelPaginatorContract<Subsection> = await SubsectionService.paginate({
        page,
        baseUrl,
        relations: ['area'],
      })

      return view.render('pages/subsection/index', { subsections })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async create({ view, session, response }: HttpContextContract) {
    try {
      const areas: Area[] = await AreaService.getAll()

      return await view.render('pages/subsection/create', { areas })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async store({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(SubsectionValidator)

    try {
      await SubsectionService.create(payload)

      session.flash('success', ResponseMessages.SUCCESS)
      response.redirect().toRoute('subsections.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ view, params, response, session }: HttpContextContract) {
    const id: Area['id'] = params.id

    try {
      const areas: Area[] = await AreaService.getAll()
      const item: Subsection = await SubsectionService.get(id)

      return view.render('pages/subsection/edit', { item, areas })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    const id: Subsection['id'] = params.id
    const payload = await request.validate(SubsectionValidator)

    try {
      await SubsectionService.update(id, payload)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().toRoute('subsections.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const id: Subsection['id'] = params.id

    try {
      await SubsectionService.delete(id)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().back()
    } catch (err: Err | any) {
      console.log(err)
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }
}
