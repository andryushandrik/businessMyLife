import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import Feedback from "App/Models/Feedback";
import { PaginationConfig } from "Contracts/database";

export default class FeedbackService {
  
  public static async paginateFeedback(
    paginationConfig: PaginationConfig
  ): Promise<ModelPaginatorContract<Feedback>> {
    paginationConfig.baseUrl = "/feedback";
    paginationConfig.limit = 9;
    try {
      return await Feedback.query().getViaPaginate(paginationConfig)
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public static async get(id: number){
    try {
      const feedbackItem = await Feedback.findOrFail(id)
      return feedbackItem 
    } catch (error: any) {
      throw new Error("Не удалось найти обратную связь")
    }
  }

  public static async markAsCompleted(id: number){
    try {
      const feedbackItem = await Feedback.findOrFail(id)
      feedbackItem.isCompleted = true
      await feedbackItem.save()
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  public static async delete(id: number){
    try {
      const item = await Feedback.findOrFail(id)
      await item.delete()
    } catch (error: any) {
      throw new Error('Произошла ошибка во время удаления')
    }
  }
}
