// * Types
import type { DateTime } from 'luxon'
// * Types

import Drive from '@ioc:Adonis/Core/Drive'
import { BaseModel, beforeDelete, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class UploadTutorial extends BaseModel {
  public static readonly columns = [
    'id', 'isVisible', 'isEmbed',
    'title', 'media',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isVisible: boolean

  @column()
  public isEmbed: boolean

  @column()
  public title: string

  @column()
  public media: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Computed properties
   */

  @computed()
  public get isVisibleForUser(): string {
    return this.isVisible ? 'Отображается' : 'Не отображается'
  }

  /**
   * * Hooks
   */

  @beforeDelete()
  public static async deleteStoredImage(item: UploadTutorial) {
    if (item.media)
      await Drive.delete(item.media)
  }
}
