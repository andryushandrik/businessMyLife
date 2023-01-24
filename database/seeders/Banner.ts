import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { BannerFactory } from 'Database/factories'

export default class extends BaseSeeder {
	public async run() {
		try {
			await BannerFactory.createMany(15)
		} catch (err: any) {
			Logger.error(err)
		}
	}
}
