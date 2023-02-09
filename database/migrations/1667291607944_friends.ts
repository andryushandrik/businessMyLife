import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.FRIENDS

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			/**
			 * * Not nullable columns
			 */

			table.boolean('isRequest').notNullable()

			/**
			 * * Foreign keys
			 */

			table.integer('from_id').unsigned().notNullable().references(`${TABLES_NAMES.USERS}.id`).onDelete('CASCADE')

			table.integer('to_id').unsigned().notNullable().references(`${TABLES_NAMES.USERS}.id`).onDelete('CASCADE')

			table.unique(['from_id', 'to_id'])

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
