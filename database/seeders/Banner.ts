import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Logger from "@ioc:Adonis/Core/Logger";
import { BannerFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {
    try {
      await BannerFactory.createMany(15)
    } catch (error) {
      Logger.error(error)
    }
  }
}
