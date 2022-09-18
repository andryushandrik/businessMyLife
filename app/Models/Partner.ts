import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  beforeSave,
  beforeCreate,
  beforeDelete,
} from "@ioc:Adonis/Lucid/Orm";
import { PARTNER_VIDEO_MEDIA_TYPE } from "Config/database";
import Drive from "@ioc:Adonis/Core/Drive";
import { IMG_PLACEHOLDER } from "Config/drive";

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  /**
   * Not nullable columns
   */

  @column()
  public title: string;

  @column()
  public isTitleLink: boolean;

  @column()
  public media?: string;

  @column()
  public mediaType: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /**
   * Hooks
   */

  @beforeSave()
  public static formatMediaLink(item: Partner) {
    if (!item.media) return;
    if (item.$dirty.mediaType === Number(PARTNER_VIDEO_MEDIA_TYPE)) {
      const newMediaLink = this.formatIframeLink(item.media);
      item.media = newMediaLink;
    }
  }

  @beforeCreate()
  public static async getDefaultImage(item: Partner) {
    if (!item.media) {
      item.media = IMG_PLACEHOLDER;
    }
  }

  @beforeDelete()
  public static async deleteStoredImage(item: Partner) {
    if (item.media) {
      await Drive.delete(item.media);
    }
  }

  /**
   * Methods
   */

  private static formatIframeLink(originalLink: string) {
    if (originalLink.includes("/embed/")) return originalLink;

    const isYoutube: boolean = originalLink
      .toLowerCase()
      .includes("youtube.com");
    const isRutube: boolean = originalLink.toLowerCase().includes("rutube.ru");

    let newLink: string = "";

    if (isYoutube) {
      newLink = originalLink.replace("watch?v=", "embed/");
    }

    if (isRutube) {
      newLink = originalLink.replace("video", "play/embed");
    }
    return newLink ?? originalLink;
  }
}
