import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PARTNER_VIDEO_LINK_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PARTNERS

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			/**
			 * * Not nullable columns
			 */

			table.boolean('isVisible').defaultTo(1).notNullable()
			table.boolean('isTitleLink').defaultTo(0).notNullable().comment('Название кликабельное или нет')

			table.string('title').notNullable()
			table.string('media', PARTNER_VIDEO_LINK_MAX_LENGTH).notNullable()
			table.boolean('mediaType').unsigned().notNullable().comment('0 - изображение, 1 - видео')

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
