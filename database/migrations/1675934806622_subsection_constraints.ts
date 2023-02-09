import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.SUBSECTIONS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropUnique(['name'])
			table.unique(['name', 'area_id'])
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropUnique(['name', 'area_id'])
		})
	}
}
