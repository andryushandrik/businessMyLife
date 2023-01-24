import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.REPORT_TYPES

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			/**
			 * * Not nullable columns
			 */

			table.boolean('isForUsers').defaultTo(0).notNullable()
			table.boolean('isForOffers').defaultTo(0).notNullable()

			table.string('name').unique().notNullable()

			/**
			 * * Timestamps
			 */

			table.timestamp('createdAt', { useTz: true }).notNullable()
			table.timestamp('updatedAt', { useTz: true }).notNullable()
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
