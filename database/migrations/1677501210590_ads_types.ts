import { TABLES_NAMES } from './../../config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.ADS_TYPES

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.integer('priceThreeMonths').unsigned()
			table.integer('priceSixMonths').unsigned()
			table.string('place')
			table.string('status')
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
