import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PAYMENTS

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table.integer('user_id').unsigned().nullable().references(`${TABLES_NAMES.USERS}.id`).onDelete('SET NULL')
			table.double('amount')
			table.string('description')
			table.integer('promocode_id').unsigned().nullable().references(`${TABLES_NAMES.PROMO_CODES}.id`).onDelete('SET NULL')
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
