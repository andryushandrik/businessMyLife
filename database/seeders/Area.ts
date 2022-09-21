import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { AreaFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {

    try {
      await AreaFactory.with('subsections', 2).createMany(10)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
