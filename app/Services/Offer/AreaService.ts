// * Types
import type AreaValidator from 'App/Validators/Offer/AreaValidator'
import type AreaFilterValidator from 'App/Validators/Offer/AreaFilterValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Area from 'App/Models/Offer/Area'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class AreaService {
  public static async paginate(config: PaginateConfig<Area>, filter?: AreaFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Area>> {
    let query: ModelQueryBuilderContract<typeof Area> = Area.query()

    if (filter)
      query = this.filter(query, filter)


    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async getAll(): Promise<Area[]> {
    try {
      return await Area.all()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Area['id']): Promise<Area> {
    let item: Area | null

    try {
      item = await Area.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: AreaValidator['schema']['props']): Promise<Area> {
    try {
      return await Area.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async update(id: Area['id'], payload: AreaValidator['schema']['props']): Promise<Area> {
    let item: Area

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async delete(id: Area['id']): Promise<void> {
    let item: Area

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

  private static filter(query: ModelQueryBuilderContract<typeof Area>, payload: AreaFilterValidator['schema']['props']): ModelQueryBuilderContract<typeof Area> {
    for (const key in payload) {
      if (payload[key]) {

        switch (key) {
          // Skip this api's keys
          case 'page':
          case 'limit':
          case 'orderBy':
          case 'orderByColumn':
            break
          // Skip this api's keys

          case 'query':
            query = query.withScopes((scopes) => scopes.search(payload[key]!))

            break

          default:
            break
        }

      }
    }

    return query
  }
}
