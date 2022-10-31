// * Types
import type Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import OfferImage from 'App/Models/Offer/OfferImage'
import { OFFER_FOLDER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class OfferImageService {
  public static async createMany(offerId: Offer['id'], images: MultipartFileContract[], trx: TransactionClientContract): Promise<void> {
    try {
      const offerImages: Partial<ModelAttributes<OfferImage>>[] = []

      for (const item of images) {
        const imagePath: string = await this.uploadImage(offerId, item)

        offerImages.push({
          offerId,
          image: imagePath,
        })
      }

      await OfferImage.createMany(offerImages, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async delete(id: OfferImage['id']): Promise<void> {
    let item: OfferImage

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

  private static async get(id: OfferImage['id']): Promise<OfferImage> {
    let item: OfferImage | null

    try {
      item = await OfferImage.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  private static async uploadImage(id: Offer['id'], image: MultipartFileContract): Promise<string> {
    const path: string = `${OFFER_FOLDER_PATH}/${id}`

    try {
      await image.moveToDisk(path)
      return `${path}/${image.fileName}`
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
