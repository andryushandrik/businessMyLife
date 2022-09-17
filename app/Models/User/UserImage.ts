// * Types
import type User from './User'
import type { DateTime } from 'luxon'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserImage extends BaseModel {
  public static readonly table: string = TABLES_NAMES.USERS_IMAGES
  public static readonly columns = [
    'id',
    'image',
    'userId',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public image: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
