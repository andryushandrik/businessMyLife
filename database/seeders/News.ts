import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Logger from "@ioc:Adonis/Core/Logger";
import { NewsFactory } from "Database/factories";

export default class extends BaseSeeder {
  public async run() {
    try {
      await NewsFactory.createMany(20);
    } catch (error: any) {
      Logger.error(error);
    }
  }
}
