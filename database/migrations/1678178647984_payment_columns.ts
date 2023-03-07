import { TABLES_NAMES } from './../../config/database';
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.PAYMENTS

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('payment_target')
      table.string('target_table')
      table.integer('target_id')

    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('target_table')
      table.dropColumn('target_id')
      table.string('payment_target')

    })
  }
}
