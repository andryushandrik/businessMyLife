// * Types
import type User from './User'
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Session extends BaseModel {
  public static readonly columns = [
    'id',
    'token', 'fingerprint', 'userAgent', 'ip',
    'userId',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @column()
  public fingerprint: string

  @column()
  public userAgent: string

  @column()
  public ip: string

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
