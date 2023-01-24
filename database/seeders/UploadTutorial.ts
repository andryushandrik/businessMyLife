import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UploadTutorialFactory } from 'Database/factories'

export default class extends BaseSeeder {
	public async run() {
		try {
			await UploadTutorialFactory.createMany(5)
		} catch (err: any) {
			Logger.error(err)
		}
	}
}
