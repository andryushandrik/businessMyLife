// * Types
import type { Err } from 'Contracts/response'
import type { PaginationConfig } from 'Contracts/database'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Feedback from 'App/Models/Feedback'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class FeedbackService {
  public static async paginate(config: PaginationConfig, orderByIsCompleted?: 'asc' | 'desc'): Promise<ModelPaginatorContract<Feedback>> {
    let query = Feedback.query()

    if (orderByIsCompleted) {
      query = query.orderBy([
        { column: 'isCompleted', order: orderByIsCompleted },
        { column: 'id', order: 'asc' },
      ])
    }

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
}
