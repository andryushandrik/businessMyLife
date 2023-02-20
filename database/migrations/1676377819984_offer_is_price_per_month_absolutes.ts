import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.OFFERS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.boolean('isPricePerMonthAbsolute')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('isPricePerMonthAbsolute')
		})
	}
}
