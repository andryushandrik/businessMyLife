// * Types
import type { MainPageVideo } from 'Contracts/mainPageVideo'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import BannerService from 'App/Services/BannerService'
import ResponseService from 'App/Services/ResponseService'
import MainPageVideoService from 'App/Services/MainPageVideoService'
import { ResponseMessages } from 'Config/response'

export default class IndexController {
  public async getProjectData({ response }: HttpContextContract) { // Without try catch, because it will never tried error
    const mainPageVideoData: MainPageVideo = await MainPageVideoService.get()
    const bannersDelay: number | null = (await BannerService.getBannersDelay()) ?? null

    return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, {
      bannersDelay,
      ...mainPageVideoData,
    }))
  }
}
