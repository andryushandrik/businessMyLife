// * Types
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Role from 'App/Models/User/Role'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { ROLE_NAMES } from 'Config/user'

export default class extends BaseSeeder {
  public async run() {

    try {
      const roles: Partial<ModelAttributes<Role>>[] = []

      for (const item of ROLE_NAMES) {
        roles.push({ name: item })
      }

      await Role.createMany(roles)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
