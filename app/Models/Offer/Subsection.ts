// * Types
import type { DateTime } from 'luxon'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Area from './Area'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { BaseModel, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Subsection extends BaseModel {
  public static readonly columns = [
    'id',
    'name',
    'areaId',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'area_id' })
  public areaId: Area['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Computed properties
   */

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
  }

  /**
   * * Relations
   */

  @belongsTo(() => Area)
  public area: BelongsTo<typeof Area>
}
