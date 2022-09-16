import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  /**
   * Not nullable columns
  */

  @column()
  public title: string

  @column()
  public isTitleLink: boolean

  @column()
  public media: string

  @column()
  public mediaType: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
