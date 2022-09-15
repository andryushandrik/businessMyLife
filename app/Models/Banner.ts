import { DateTime } from 'luxon'
import { BaseModel, column, beforeDelete, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import Drive from "@ioc:Adonis/Core/Drive"
import { IMG_PLACEHOLDER } from 'Config/drive'

export default class Banner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

/**
 * Not nullable columns
 */

  @column()
  public image: string

  @column()
  public title: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Hooks
   */

  @beforeCreate()
  public static async getDefaultImage(item: Banner){
    if(!item.image){
      item.image = IMG_PLACEHOLDER
    }
  }

  @beforeDelete()
  public static async deleteStoredImage(item: Banner){
    if(item.image){
      await Drive.delete(item.image)
    }
  }

}
