import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.ADS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('place')
			table.integer('ads_type_id').unsigned().nullable().references(`${TABLES_NAMES.ADS_TYPES}.id`).onDelete('SET NULL')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('place')
			table.dropForeign('ads_type_id')
			table.dropColumn('ads_type_id')
		})
	}
}
