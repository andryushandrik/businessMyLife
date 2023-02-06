import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.EMAIL_SUBSCRIBERS

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			table.string('email')
			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('createdAt', { useTz: true })
			table.timestamp('updatedAt', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
