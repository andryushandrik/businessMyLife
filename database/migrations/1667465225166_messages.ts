import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { MESSAGE_TEXT_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.MESSAGES

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			/**
			 * * Not nullable columns
			 */

			table.boolean('isViewed').defaultTo(0).notNullable()
			table.string('text', MESSAGE_TEXT_MAX_LENGTH).notNullable()

			/**
			 * * Foreign keys
			 */

			table
				.integer('user_id')
				.unsigned()
				.notNullable()
				.references(`${TABLES_NAMES.USERS}.id`)
				.onDelete('CASCADE')

			table
				.integer('conversation_id')
				.unsigned()
				.notNullable()
				.references(`${TABLES_NAMES.CONVERSATIONS}.id`)
				.onDelete('CASCADE')

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
