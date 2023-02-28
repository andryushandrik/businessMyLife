import { TABLES_NAMES } from 'Config/database';
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.ADS

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('link').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('link')
    })
  }
}
