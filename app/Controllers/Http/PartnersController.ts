// * Types
import type Partner from 'App/Models/Partner'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import PartnerService from 'App/Services/PartnerService'
import PartnerWithImageValidator from 'App/Validators/Partner/PartnerWithImageValidator'
import PartnerWithVideoValidator from 'App/Validators/Partner/PartnerWithVideoValidator'
import { ResponseMessages } from 'Config/response'

export default class PartnersController {
  public async index({ view, request, response, session, route }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const partners: ModelPaginatorContract<Partner> = await PartnerService.paginate({ page, baseUrl })

      return view.render('pages/partner/index', { partners })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async create({ view, request, response }: HttpContextContract) {
    const mediaType: boolean | null = request.input('mediaType', null)

    if (mediaType === null)
      return response.redirect().back()

    return view.render('pages/partner/create', { mediaType })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const mediaType: boolean = request.input('mediaType') === 'true'
    let payload: (PartnerWithImageValidator | PartnerWithVideoValidator)['schema']['props']

    if (mediaType)
      payload = await request.validate(PartnerWithVideoValidator)
    else
      payload = await request.validate(PartnerWithImageValidator)

    try {
      await PartnerService.create(payload)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().toRoute('partners.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async show({ view, params, session, response }: HttpContextContract) {
    const id: Partner['id'] = params.id

    try {
      const item: Partner = await PartnerService.get(id)

      return view.render('pages/partner/show', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ params, response, view, session }: HttpContextContract) {
    const id: Partner['id'] = params.id

    try {
      const item: Partner = await PartnerService.get(id)

      return view.render('pages/partner/edit', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    const id: Partner['id'] = params.id
    const mediaType: boolean = request.input('mediaType') === 'true'
    let payload: (PartnerWithImageValidator | PartnerWithVideoValidator)['schema']['props']

    if (mediaType)
      payload = await request.validate(PartnerWithVideoValidator)
    else
      payload = await request.validate(PartnerWithImageValidator)

    try {
      await PartnerService.update(id, payload)

      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().toRoute('partners.index')
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const id: Partner['id'] = params.id

    try {
      await PartnerService.delete(id)
      session.flash('success', ResponseMessages.SUCCESS)
      return response.redirect().back()
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }
}
