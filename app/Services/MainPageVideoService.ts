// * Types
import type MainPageVideoValidator from 'App/Validators/MainPageVideoValidator'
import type { Err } from 'Contracts/response'
import type { MainPageVideo } from 'Contracts/mainPageVideo'
// * Types

import RedisService from './RedisService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import { RedisKeys } from 'Config/redis'
import { MAIN_PAGE_VIDEO_FOLDER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class MainPageVideoService {
  public static async get(): Promise<MainPageVideo> {
    const item: MainPageVideo = {
      title: '',
      description: '',
      videoPath: '',
    }

    try {
      item.title = await RedisService.get(RedisKeys.MAIN_PAGE_VIDEO, 'title')
    } catch (err: Err | any) {}

    try {
      item.description = await RedisService.get(RedisKeys.MAIN_PAGE_VIDEO, 'description')
    } catch (err: Err | any) {}

    try {
      item.videoPath = await RedisService.get(RedisKeys.MAIN_PAGE_VIDEO, 'videoPath')
    } catch (err: Err | any) {}

    return item
  }

  public static async update(payload: MainPageVideoValidator['schema']['props']): Promise<void> {
    let videoPath: MainPageVideo['videoPath'] = ''

    try {
      videoPath = await RedisService.get(RedisKeys.MAIN_PAGE_VIDEO, 'videoPath')
    } catch (err: Err | any) {}

    if (payload.video) {
      if (videoPath) {
        try {
          await Drive.delete(videoPath)
        } catch (err: Err | any) {
          throw err
        }
      }

      try {
        await payload.video.moveToDisk(MAIN_PAGE_VIDEO_FOLDER_PATH)
        videoPath = `${MAIN_PAGE_VIDEO_FOLDER_PATH}/${payload.video.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    try {
      await RedisService.set(RedisKeys.MAIN_PAGE_VIDEO, 'title', payload.title, {})
      await RedisService.set(RedisKeys.MAIN_PAGE_VIDEO, 'description', payload.description, {})
      await RedisService.set(RedisKeys.MAIN_PAGE_VIDEO, 'videoPath', videoPath, {})
    } catch (err: Err | any) {
      throw err
    }
  }
}
