// * Types
import { DateTime } from 'luxon'
// * Types

import { BaseModel, column, computed, scope } from '@ioc:Adonis/Lucid/Orm'

export default class ReportType extends BaseModel {
  public static readonly columns = [
    'id', 'isForUsers', 'isForOffers',
    'name',
    'createdAt', 'updatedAt'
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isForUsers: boolean

  @column()
  public isForOffers: boolean

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Computed properties
   */

  @computed()
  public get isForUsersForUser(): string {
    return this.isForUsers ? 'Да' : 'Нет'
  }

  @computed()
  public get isForOffersForUser(): string {
    return this.isForOffers ? 'Да' : 'Нет'
  }

  /**
   * * Query scopes
   */

  public static search = scope((query, searchQuery: string) => {
    query.where('name', 'ILIKE', `%${searchQuery}%`)
  })
}
