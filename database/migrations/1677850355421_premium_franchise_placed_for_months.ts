import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PREMIUM_FRANCHISES

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.integer('placedForMonths')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('placedForMonths')
		})
	}
}
