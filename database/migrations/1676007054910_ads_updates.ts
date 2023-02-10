import { TABLES_NAMES } from './../../config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.ADS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().nullable().references(`${TABLES_NAMES.USERS}.id`).onDelete('SET NULL')
			table.timestamp('placed_at', { useTz: true }).nullable()
			table.timestamp('placed_untill', { useTz: true }).nullable()
      table.renameColumn('image','offer_image')
      table.string('subsection_image')
      table.string('payment_status')
		})
	}

	public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id')
			table.dropColumn('placed_at')
			table.dropColumn('placed_untill')
      table.dropColumn('offer_image')
      table.dropColumn('subsection_image')
      table.dropColumn('payment_status')
		})
	}
}
