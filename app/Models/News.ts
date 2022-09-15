// * Types
import type { DateTime } from "luxon";
// * Types

import { BaseModel, column, beforeCreate, beforeSave, beforeDelete } from "@ioc:Adonis/Lucid/Orm";
import cyrillicToTranslit from 'cyrillic-to-translit-js'
import Drive from "@ioc:Adonis/Core/Drive"

export default class News extends BaseModel {
  public static readonly columns = [
    'id', "slug", "title", "description", "viewsCount", 
    "suptitle", "image", "readingTimeFrom", "readingTimeTo",
    'createdAt', 'updatedAt',
  ] as const
  
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public viewsCount: number;

  @column()
  public slug?: string | null;

  @column()
  public suptitle?: string | null;

  @column()
  public image?: string | null;

  @column()
  public readingTimeFrom?: number | null;

  @column()
  public readingTimeTo?: number | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

    /**
   * Hooks
   */

  @beforeCreate()
  public static setDefaultViewsCount(item: News){
    if(!item.$dirty.viewsCount){
      item.viewsCount = 0
    }
  }
  
  @beforeCreate()
  public static setDefaultSlug(item: News){
    if(!item.slug && item.title){
      const rawSlug = (item.title as any).toLowerCase().replaceAll(' ', '_')
      const formattedSlug = cyrillicToTranslit().transform(rawSlug)
      item.slug = formattedSlug
    }
  }

  @beforeSave()
  public static formatSlug(item: News){
    if(item.$dirty.slug){
      const rawSlug = item.$dirty.slug.toLowerCase().replaceAll(' ', '_')
      const formattedSlug = cyrillicToTranslit().transform(rawSlug)
      item.slug = formattedSlug
    }
  }

  @beforeDelete()
  public static async deleteStoredImage(item: News){
    if(item.image){
      await Drive.delete(item.image)
    }
  }
}
