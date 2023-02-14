import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.OFFERS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.integer('placedForMonths')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.dropColumn('placedForMonths')
		})
	}
}

