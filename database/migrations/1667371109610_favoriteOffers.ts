import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.FAVORITE_OFFERS

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			/**
			 * * Foreign keys
			 */

			table.integer('offer_id').unsigned().notNullable().references(`${TABLES_NAMES.OFFERS}.id`)
			table.integer('user_id').unsigned().notNullable().references(`${TABLES_NAMES.USERS}.id`)

			table.unique(['offer_id', 'user_id'])

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
