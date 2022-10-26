// * Types
import type FeedbackValidator from 'App/Validators/Feedback/FeedbackValidator'
import type FeedbackFilterValidator from 'App/Validators/Feedback/FeedbackFilterValidator'
import type { Err } from 'Contracts/response'
import type { PaginationConfig } from 'Contracts/database'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Feedback from 'App/Models/Feedback'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class FeedbackService {
  public static async paginate(config: PaginationConfig, filter?: FeedbackFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Feedback>> {
    let query = Feedback.query()

    if (filter)
      query = this.filter(query, filter)

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Feedback['id']): Promise<Feedback> {
    let item: Feedback | null

    try {
      item =  await Feedback.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: FeedbackValidator['schema']['props']): Promise<void> {
    try {
      await Feedback.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async delete(id: Feedback['id']): Promise<void> {
    let item: Feedback

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

  public static async markAsCompleted(id: Feedback['id']): Promise<void> {
    let item: Feedback

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ isCompleted: true }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static filter(query: ModelQueryBuilderContract<typeof Feedback>, payload: FeedbackFilterValidator['schema']['props']): ModelQueryBuilderContract<typeof Feedback> {
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
