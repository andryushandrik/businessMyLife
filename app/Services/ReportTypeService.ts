// * Types
import type ReportTypeValidator from 'App/Validators/Report/ReportTypeValidator'
import type ReportTypeFilterValidator from 'App/Validators/Report/ReportTypeFilterValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelAttributes, ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import ReportType from 'App/Models/ReportType'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class ReportTypeService {
  public static async paginate(config: PaginateConfig<ReportType>, filter?: ReportTypeFilterValidator['schema']['props']): Promise<ModelPaginatorContract<ReportType>> {
    let query: ModelQueryBuilderContract<typeof ReportType> = ReportType.query()

    if (filter)
      query = this.filter(query, filter)

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: ReportType['id']): Promise<ReportType> {
    let item: ReportType | null

    try {
      item = await ReportType.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: ReportTypeValidator['schema']['props']): Promise<void> {
    const reportTypePayload: Partial<ModelAttributes<ReportType>> = {
      name: payload.name,
      isForUsers: Boolean(payload.isForUsers),
      isForOffers: Boolean(payload.isForOffers),
    }

    try {
      await ReportType.create(reportTypePayload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async update(id: ReportType['id'], payload: ReportTypeValidator['schema']['props']): Promise<void> {
    let item: ReportType
    const reportTypePayload: Partial<ModelAttributes<ReportType>> = {
      name: payload.name,
      isForUsers: Boolean(payload.isForUsers),
      isForOffers: Boolean(payload.isForOffers),
    }

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge(reportTypePayload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async delete(id: ReportType['id']): Promise<void> {
    let item: ReportType

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static filter(query: ModelQueryBuilderContract<typeof ReportType>, payload: ReportTypeFilterValidator['schema']['props']): ModelQueryBuilderContract<typeof ReportType> {
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
