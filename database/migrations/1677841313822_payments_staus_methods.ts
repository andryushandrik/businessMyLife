import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PAYMENTS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('method')
			table.string('status')
			table.string('payment_target')
		})
	}
	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('method')
			table.dropColumn('status')
			table.dropColumn('payment_target')
		})
	}
}
