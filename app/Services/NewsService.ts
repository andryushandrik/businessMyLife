// * Types
import type NewsValidator from 'App/Validators/NewsValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
// * Types

import News from 'App/Models/News'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import { NEWS_FOLDER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class NewsService {
  public static async paginateNews(config: PaginateConfig<News>): Promise<ModelPaginatorContract<News>> {
    try {
      return await News.query().getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: News['id']): Promise<News> {
    let item: News | null

    try {
      item =  await News.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: NewsValidator['schema']['props']): Promise<News> {
    let item: News

    try {
      item = await News.create({ ...payload, image: undefined })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (payload.image) {
      try {
        const uploadedFilePath: string = await this.uploadImage(item.id, payload.image)
        await item.merge({ image: uploadedFilePath }).save()
      } catch (err: Err | any) {
        throw err
      }
    }

    return item
  }

  public static async update(id: News['id'], payload: NewsValidator['schema']['props']): Promise<News> {
    let item: News

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ ...payload, image: item.image }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (payload.image) {
      try {
        if (item.image)
          await Drive.delete(item.image)

        const uploadedFilePath: string = await this.uploadImage(item.id, payload.image)
        await item.merge({ image: uploadedFilePath }).save()
      } catch (err: Err | any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    return item
  }

  public static async delete(id: News['id']): Promise<void> {
    let item: News

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static async uploadImage(id: News['id'], image: MultipartFileContract): Promise<string> {
    const fileName: string = `${id}_${image.clientName}`

    try {
      await image.moveToDisk(NEWS_FOLDER_PATH, { name: fileName })
      return `${NEWS_FOLDER_PATH}/${fileName}`
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
