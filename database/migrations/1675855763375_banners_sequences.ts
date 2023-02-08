import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.BANNERS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.integer('order_number').defaultTo(1)
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('order_number')
		})
	}
}
