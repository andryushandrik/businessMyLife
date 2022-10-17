// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class PromoCode extends BaseModel {
  public static readonly columns = [
    'id',
    'name', 'code', 'discountPrice',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public discountPrice: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Query scopes
   */

  public static search = scope((query, searchQuery: string) => {
    query.where('name', 'ILIKE', `%${searchQuery}%`)
  })
}
