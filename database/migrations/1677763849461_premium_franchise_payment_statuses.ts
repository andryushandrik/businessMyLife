import { TABLES_NAMES } from './../../config/database';
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.PREMIUM_FRANCHISES

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('paymentStatus')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('paymentStatus')
    })
  }
}
