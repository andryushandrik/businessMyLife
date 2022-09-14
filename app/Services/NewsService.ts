import News from "App/Models/News";
import Logger from "@ioc:Adonis/Core/Logger";
import { PaginationConfig } from "Contracts/database";
import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import NewsValidator from "App/Validators/NewsValidator";
import type { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { NEWS_FOLDER_PATH } from "Config/drive";
import Database from '@ioc:Adonis/Lucid/Database';
import Drive from "@ioc:Adonis/Core/Drive"

export default class NewsService {
  public static async paginateNews(
    paginationConfig: PaginationConfig
  ): Promise<ModelPaginatorContract<News>> {
    paginationConfig.page = paginationConfig.page ?? 1;
    paginationConfig.limit = 9;
    paginationConfig.baseUrl = "/news";

    try {
      return await News.query().getViaPaginate(paginationConfig);
    } catch (error: any) {
      Logger.error(error);
      throw new Error()
    }
  }

  public static async get(id: number){
    try {
      const item =  await News.find(id)
      if(!item) throw new Error("Новость не найдена")

      return item
    } catch (error) {
      throw new Error(error)
    }
  }

  public static async create(payload: NewsValidator["schema"]["props"]) {
    let newsItem: News
    const trx = await Database.transaction()
    try {
      newsItem = await News.create({ ...payload, image: undefined }, {client: trx})
    } catch (error: any) {
      trx.rollback()
      throw new Error(error)
    }

    if (payload.image) {
      try {
        const uploadedFilePath = await this.uploadImage(newsItem.id, payload.image)
        await newsItem.merge({image: uploadedFilePath}).save()
      } catch (error) {
        trx.rollback()
        throw new Error("Произошла ошибка во время загрузки файла")
      }
    }

    trx.commit()
  }

  public static async edit(id:number, payload: NewsValidator["schema"]["props"]){
    let newsItem: News
    const trx = await Database.transaction()

    try {
      newsItem = await News.findOrFail(id, {client: trx})
      await newsItem.merge({...payload, image: newsItem.image}).save()
    } catch (error) {
      trx.rollback()
      throw new Error(error)
    }

    if(payload.image){
      if(newsItem.image){
        await Drive.delete(newsItem.image)
      }

      try {
        const uploadedFilePath = await this.uploadImage(newsItem.id, payload.image)
        await newsItem.merge({image: uploadedFilePath}).save()
      } catch (error) {
        trx.rollback()
        throw new Error("Произошла ошибка во время загрузки файла")
      }
    }

    trx.commit()
  }

  public static async delete(id: number) {
    try {
      const item = await News.find(id);
      if (item) await item.delete();
    } catch (error) {
      throw new Error(error);
    }
  }

  public static async uploadImage(id: number, image: MultipartFileContract) {
    const fileName = `${id}_${image.clientName}`
    try {
      await image.moveToDisk(NEWS_FOLDER_PATH, {name: fileName})
      return `${NEWS_FOLDER_PATH}/${fileName}`
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
