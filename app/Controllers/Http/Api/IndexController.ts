// * Types
import type Banner from 'App/Models/Banner'
import type { Err } from 'Contracts/response'
import type { MainPageVideo } from 'Contracts/mainPageVideo'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import BannerService from 'App/Services/BannerService'
import ResponseService from 'App/Services/ResponseService'
import FeedbackService from 'App/Services/FeedbackService'
import ExceptionService from 'App/Services/ExceptionService'
import MainPageVideoService from 'App/Services/MainPageVideoService'
import UploadTutorialService from 'App/Services/UploadTutorialService'
import FeedbackValidator from 'App/Validators/Feedback/FeedbackValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class IndexController {
  public async getProjectData({ response }: HttpContextContract) { // Without try catch, because it will never tried error
    const mainPageVideoData: MainPageVideo = await MainPageVideoService.get()
    const bannersDelay: number | null = (await BannerService.getBannersDelay()) ?? null

    return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, {
      bannersDelay,
      ...mainPageVideoData,
    }))
  }

  public async createFeedback({ request, response }: HttpContextContract) {
    let payload: FeedbackValidator['schema']['props']

    try {
      payload = await request.validate(FeedbackValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await FeedbackService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async getAllBanners({ response }: HttpContextContract) {
    try {
      const banners: Banner[] = await BannerService.getAll()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, banners))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateUploadTutorials({ request, response }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: Err | any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const tutorials = await UploadTutorialService.paginate(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, tutorials))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
