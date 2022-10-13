// * Types
import type { DateTime } from 'luxon'
// * Types

import Drive from '@ioc:Adonis/Core/Drive'
import { BaseModel, column, beforeDelete, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Partner extends BaseModel {
  public static readonly columns = [
    'id',
    'isTitleLink',
    'title', 'media',
    'mediaType',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isTitleLink: boolean

  @column()
  public title: string

  @column()
  public media: string

  @column()
  public mediaType: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Query scopes
   */

  public static search = scope((query, searchQuery: string) => {
    query.where('title', 'ILIKE', `%${searchQuery}%`)
  })

  /**
   * * Hooks
   */

  @beforeDelete()
  public static async deleteStoredImage(item: Partner) {
    if (item.media)
      await Drive.delete(item.media)
  }
}
