import { TABLES_NAMES } from 'Config/database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.PREMIUM_SLOTS

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.double('priceThreeMonths')
			table.double('priceSixMonths')
		})
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('priceThreeMonths')
			table.dropColumn('priceSixMonths')
		})
	}
}
