import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PREMIUM_SLOTS

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table.string('title')
			table.string('type')
			table.string('image')
			table.integer('franchise_id').unsigned().nullable().references(`${TABLES_NAMES.PREMIUM_FRANCHISES}.id`).onDelete('SET NULL')
			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
