// * Types
import type OfferBlockDescriptionValidator from 'App/Validators/Offer/OfferBlockDescriptionValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Offer from 'App/Models/Offer/Offer'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class OfferService {
  public static async paginate(config: PaginateConfig<Offer>): Promise<ModelPaginatorContract<Offer>> {
    let query: ModelQueryBuilderContract<typeof Offer> = Offer.query()

    if (config.relations) {
      for (const item of config.relations) {
        query = query.preload(item)
      }
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Offer['id'], { relations }: ServiceConfig<Offer> = {}): Promise<Offer> {
    let item: Offer | null

    try {
      item = await Offer.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    try {
      if (relations) {
        for (const relation of relations) {
          await item.load(relation)
        }
      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    return item
  }

  public static async updateBlockDescription(id: Offer['id'], payload: OfferBlockDescriptionValidator['schema']['props']): Promise<void> {
    let item: Offer

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async archiveAction(id: Offer['id'], isArchived: boolean): Promise<void> {
    let item: Offer

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ isArchived }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
