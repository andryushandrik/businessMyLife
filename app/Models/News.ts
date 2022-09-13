// * Types
import type { DateTime } from "luxon";
// * Types

import { BaseModel, column, beforeCreate, beforeSave } from "@ioc:Adonis/Lucid/Orm";
import cyrillicToTranslit from 'cyrillic-to-translit-js'

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
  public slug: string;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public viewsCount: number;

  @column()
  public suptitle?: string;

  @column()
  public image?: string;

  @column()
  public readingTimeFrom?: number;

  @column()
  public readingTimeTo?: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

    /**
   * Hooks
   */

  @beforeCreate()
  public static setDefaultViewsCount(news: News){
    if(!news.$dirty.viewsCount){
      news.viewsCount = 0
    }
  }

  @beforeSave()
  public static formatSlug(news: News){
    let formattedSlug: string
    if(news.$dirty.slug){
      const rawSlug = news.$dirty.slug.toLowerCase().replaceAll(' ', '_')
      formattedSlug = cyrillicToTranslit().transform(rawSlug)
    }
    else{
      const rawSlug = news.$dirty.title.toLowerCase().replaceAll(' ', '_')
      formattedSlug = cyrillicToTranslit().transform(rawSlug)
    }

    news.slug = formattedSlug
  }
}
