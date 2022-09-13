// * Types
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import UserType from 'App/Models/User/UserType'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { TYPES_NAMES } from 'Config/user'

export default class extends BaseSeeder {
  public async run () {

    try {
      const types: Partial<ModelAttributes<UserType>>[] = []

      for (const item of TYPES_NAMES) {
        types.push({ name: item })
      }

      await UserType.createMany(types)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
