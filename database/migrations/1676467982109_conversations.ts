import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.CONVERSATIONS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('offer_id')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.integer('offer_id').unsigned().nullable().references(`${TABLES_NAMES.OFFERS}.id`).onDelete('CASCADE')
		})
	}
}
