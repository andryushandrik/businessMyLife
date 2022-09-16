import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Logger from "@ioc:Adonis/Core/Logger";
import { PartnersFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {
    try {
      await PartnersFactory.createMany(20)
    } catch (error) {
      Logger.error(error)
    }
  }
}
