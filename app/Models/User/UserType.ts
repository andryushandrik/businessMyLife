// * Types
import type { DateTime } from 'luxon'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserType extends BaseModel {
  public static readonly table: string = TABLES_NAMES.USERS_TYPES
  public static readonly columns = [
    'id',
    'name',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Hooks
   */

  @beforeSave()
  public static nameToLowerCase(item: UserType) {
    if (item.$dirty.name)
      item.name = item.name.toLowerCase()
  }
}
