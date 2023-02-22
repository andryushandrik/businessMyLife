import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PREMIUM_FRANCHISES

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.unique(['offer_id'])
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropUnique(['offer_id'])
		})
	}
}

