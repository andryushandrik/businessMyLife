import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Logger from "@ioc:Adonis/Core/Logger"
import { FeedbackFactory } from 'Database/factories' 

export default class extends BaseSeeder {
  public async run() {
    try {
      await FeedbackFactory.createMany(25)
    } catch (error: any) {
      Logger.error(error)
    }
  }
}
