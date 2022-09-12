// * Types
import type { DateTime } from "luxon";
// * Types

import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class News extends BaseModel {
  public readonly columns = [
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
}
