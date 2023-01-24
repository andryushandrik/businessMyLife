import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { NewsFactory } from 'Database/factories'

export default class extends BaseSeeder {
	public async run() {
		try {
			await NewsFactory.createMany(5)
		} catch (err: any) {
			Logger.error(err)
		}
	}
}
