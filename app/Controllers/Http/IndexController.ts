// * Types
import type { Err } from 'Contracts/response'
import type { MainPageVideo } from 'Contracts/mainPageVideo'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import MainPageVideoService from 'App/Services/MainPageVideoService'
import MainPageVideoValidator from 'App/Validators/MainPageVideoValidator'
import { ResponseMessages } from 'Config/response'

export default class IndexController {
  public async home({ view }: HttpContextContract) {
    return view.render('pages/index')
  }

  public async mainPageVideo({ view, session, response }: HttpContextContract) {
    try {
      const item: MainPageVideo = await MainPageVideoService.get()

      return view.render('pages/mainPageVideo', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async updateMainPageVideo({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(MainPageVideoValidator)

    try {
      await MainPageVideoService.update(payload)

      session.flash('success', ResponseMessages.SUCCESS)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
