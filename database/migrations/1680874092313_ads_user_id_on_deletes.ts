import { TABLES_NAMES } from './../../config/database';
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.ADS

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().nullable().references(`${TABLES_NAMES.USERS}.id`).onDelete('CASCADE').onUpdate('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

    })
  }
}
