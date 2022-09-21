import { DateTime } from 'luxon'
import { BaseModel, column, beforeDelete } from '@ioc:Adonis/Lucid/Orm'
import Drive from '@ioc:Adonis/Core/Drive'

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
   * * Hooks
   */

  @beforeDelete()
  public static async deleteStoredImage(item: Partner) {
    if (item.media)
      await Drive.delete(item.media)
  }
}
