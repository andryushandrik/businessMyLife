// * Types
import type Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import OfferService from 'App/Services/Offer/OfferService'
import OfferBlockDescriptionValidator from 'App/Validators/Offer/OfferBlockDescriptionValidator'
import { ResponseMessages } from 'Config/response'

export default class OffersController {
  public async paginate({ request, response, route, view, session }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginate({ page, baseUrl, relations: ['user', 'subsection'] })

      return view.render('pages/offer/paginate', { offers })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async get({ view, params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      const item: Offer = await OfferService.get(id, { relations: ['user', 'subsection', 'images'] })

      return view.render('pages/offer/get', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async updateBlockDescription({ request, response, session, params }: HttpContextContract) {
    const id: Offer['id'] = params.id
    const payload = await request.validate(OfferBlockDescriptionValidator)

    try {
      await OfferService.updateBlockDescription(id, payload)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async archive({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.archiveAction(id, true)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unarchive({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.archiveAction(id, false)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
