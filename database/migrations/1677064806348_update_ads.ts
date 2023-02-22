import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.ADS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.renameColumn('offer_image', 'image')
			table.string('place')
			table.dropColumn('subsection_image')
      table.integer('subsection_id').unsigned().nullable().references(`${TABLES_NAMES.SUBSECTIONS}.id`).onDelete('SET NULL')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.renameColumn('image', 'offer_image')
			table.dropColumn('place')
			table.dropForeign('subsection_id')
			table.dropColumn('subsection_id')
		})
	}
}

