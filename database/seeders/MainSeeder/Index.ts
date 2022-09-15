import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (Seeder.default.developmentOnly && !Application.inDev) return

    await new Seeder.default(this.client).run()
  }

  public async run () {
    /**
     * * User
     */

    await this.runSeeder(await import('../User/Role'))
    await this.runSeeder(await import('../User/UserType'))
    await this.runSeeder(await import('../User/User'))
  }
}
