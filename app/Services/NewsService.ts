import News from "App/Models/News"
import Logger from "@ioc:Adonis/Core/Logger"
import { PaginationConfig } from "Contracts/database"
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import NewsValidator from 'App/Validators/NewsValidator'


export default class NewsService {
  public static async paginateNews(
    paginationConfig: PaginationConfig
  ): Promise<ModelPaginatorContract<News>> {
    paginationConfig.page = paginationConfig.page ?? 1
    paginationConfig.limit = 9
    paginationConfig.baseUrl = "/news"

    try {
      return await News.query().getViaPaginate(paginationConfig)
    } catch (error: any) {
      Logger.error(error);
      throw new Error();
    }
  }

  public static async create(payload: NewsValidator["schema"]["props"]){
    try {
      await News.create(payload)
    } catch (error: any) {
      //Make use of the exception service later
      throw new Error(error.message)
    }
  }
}
