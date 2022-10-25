// * Types
import type BannerValidator from 'App/Validators/Banner/BannerValidator'
import type BannerDelayValidator from 'App/Validators/Banner/BannerDelayValidator'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
// * Types

import Banner from 'App/Models/Banner'
import RedisService from './RedisService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import { RedisKeys } from 'Config/redis'
import { BANNER_FOLDER_PATH } from '../../config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class BannerService{
  public static async paginate(config: PaginateConfig<Banner>): Promise<ModelPaginatorContract<Banner>> {
    try {
      return await Banner.query().getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Banner['id'], { trx }: ServiceConfig<Banner> = {}): Promise<Banner> {
    let item: Banner | null

    try {
      item =  await Banner.find(id, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async getBannersDelay(): Promise<number | undefined> {
    let delay: number | undefined = undefined

    try {
      const delayFromRedis: string = await RedisService.get(RedisKeys.BANNER, 'delay')

      delay = Number(delayFromRedis)
    } catch (err: Err | any) {}

    return delay
  }

  public static async create(payload: BannerValidator['schema']['props']): Promise<void> {
    let banner: Banner
    const trx: TransactionClientContract = await Database.transaction()

    try {
      banner = await Banner.create({ ...payload, image: 'tmp' }, { client: trx })
    } catch (err: any) {
      trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (payload.image) {
      try {
        const filePath: string = await this.uploadImage(banner.id, payload.image)
        await banner.merge({ image: filePath }).save()
      } catch (err: Err | any) {
        trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    await trx.commit()
  }

  public static async update(id: Banner['id'], payload: BannerValidator['schema']['props']): Promise<void> {
    let banner: Banner
    const trx: TransactionClientContract = await Database.transaction()

    try {
      banner = await this.get(id, { trx })
    } catch (err: Err | any) {
      trx.rollback()

      throw err
    }

    try {
      await banner.merge({ ...payload, image: banner.image }).save()
    } catch (err: any) {
      trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (payload.image) {
      if(banner.image)
        await Drive.delete(banner.image)

      try {
        const uploadedFilePath: string = await this.uploadImage(banner.id, payload.image)
        await banner.merge({image: uploadedFilePath}).save()
      } catch (err: Err | any) {
        trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    await trx.commit()
  }

  public static async updateBannersDelay({ delay }: BannerDelayValidator['schema']['props']): Promise<void> {
    try {
      await RedisService.set(RedisKeys.BANNER, 'delay', delay, {})
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async delete(id: Banner['id']): Promise<void> {
    let item: Banner

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

  private static async uploadImage(id: Banner['id'], image: MultipartFileContract): Promise<string> {
    const fileName: string = `${id}_${image.clientName}`

    try {
      await image.moveToDisk(BANNER_FOLDER_PATH, { name: fileName })
      return `${BANNER_FOLDER_PATH}/${fileName}`
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
