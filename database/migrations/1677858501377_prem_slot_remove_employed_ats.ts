import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PREMIUM_SLOTS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('employed_at')
			table.dropColumn('employed_untill')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.timestamp('employed_at', { useTz: true }).nullable()
			table.timestamp('employed_untill', { useTz: true }).nullable()
		})
	}
}
