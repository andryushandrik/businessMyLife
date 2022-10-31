// * Types
import type Offer from './Offer'
import type { DateTime } from 'luxon'
// * Types

import Drive from '@ioc:Adonis/Core/Drive'
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'

export default class OfferImage extends BaseModel {
  public static readonly table: string = TABLES_NAMES.OFFERS_IMAGES
  public static readonly columns = [
    'id',
    'image',
    'offerId',
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

  @column({ columnName: 'offer_id' })
  public offerId: Offer['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Hooks
   */

  @beforeDelete()
  public static async deleteStoredImage(item: OfferImage) {
    await Drive.delete(item.image)
  }
}
