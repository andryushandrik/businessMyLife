import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PARTNERS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('embed')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('embed')
		})
	}
}

