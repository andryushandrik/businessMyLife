// * Types
import type User from 'App/Models/User/User'
import type Area from 'App/Models/Offer/Area'
import type Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AreaService from 'App/Services/Offer/AreaService'
import OfferService from 'App/Services/Offer/OfferService'
import OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'
import OfferBlockDescriptionValidator from 'App/Validators/Offer/OfferBlockDescriptionValidator'
import { SESSION_AUTH_KEY } from 'Config/session'
import { ResponseMessages } from 'Config/response'

export default class OffersController {
  public async paginate({ request, response, route, view, session }: HttpContextContract) {
    let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
    const isFiltered: boolean = request.input('isFiltered', false)
    const config: PaginateConfig<Offer> = {
      baseUrl: route!.pattern,
      relations: ['user', 'subsection'],
      page: request.input('page', 1),
    }

    if (isFiltered) {
      payload = await request.validate(OfferFilterValidator)

      config.orderBy = payload.orderBy
      config.orderByColumn = payload.orderByColumn
    }

    try {
      const areas: Area[] = await AreaService.getAll()
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginate(config, payload)

      return view.render('pages/offer/paginate', {
        areas,
        offers,
        payload,
      })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async paginateCurrentUserOffers({ request, response, route, view, session }: HttpContextContract) {
    let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
    const titleFromController: string = 'Мои объявления'
    const isFiltered: boolean = request.input('isFiltered', false)
    const currentUserId: User['id'] = (session.get(SESSION_AUTH_KEY) as User).id
    const config: PaginateConfig<Offer> = {
      baseUrl: route!.pattern,
      relations: ['user', 'subsection'],
      page: request.input('page', 1),
    }

    if (isFiltered) {
      payload = await request.validate(OfferFilterValidator)

      config.orderBy = payload.orderBy
      config.orderByColumn = payload.orderByColumn
    }

    try {
      const areas: Area[] = await AreaService.getAll()
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginateUserOffers(currentUserId, config, payload)

      return view.render('pages/offer/paginate', {
        areas,
        offers,
        payload,
        titleFromController,
      })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async paginateNotVerifiedOffers({ request, response, route, view, session }: HttpContextContract) {
    let payload: OfferFilterValidator['schema']['props'] | undefined = undefined
    const titleFromController: string = 'Модерация'
    const isFiltered: boolean = request.input('isFiltered', false)
    const config: PaginateConfig<Offer> = {
      baseUrl: route!.pattern,
      relations: ['user', 'subsection'],
      page: request.input('page', 1),
    }

    if (isFiltered) {
      payload = await request.validate(OfferFilterValidator)

      config.orderBy = payload.orderBy
      config.orderByColumn = payload.orderByColumn
    }

    try {
      const areas: Area[] = await AreaService.getAll()
      const offers: ModelPaginatorContract<Offer> = await OfferService.paginateNotVerifiedOffers(config, payload)

      return view.render('pages/offer/paginate', {
        areas,
        offers,
        payload,
        titleFromController,
      })
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

  /**
   * * Archive
   */

  public async archive({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'archive', true)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unarchive({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'archive', false)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  /**
   * * Ban
   */

  public async ban({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'ban', true)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unban({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'ban', false)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  /**
   * * Verify
   */

  public async verify({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'verify', true)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unverify({ params, response, session }: HttpContextContract) {
    const id: Offer['id'] = params.id

    try {
      await OfferService.actions(id, 'verify', false)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
