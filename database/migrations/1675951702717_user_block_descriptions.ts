import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.USERS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('blockDescription')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('blockDescription')
		})
	}
}
