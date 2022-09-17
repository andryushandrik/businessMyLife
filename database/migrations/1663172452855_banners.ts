import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { BANNER_DESCRIPTION_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.BANNERS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('image').notNullable()
      table.string('title').notNullable()
      table.string('description', BANNER_DESCRIPTION_MAX_LENGTH).notNullable()

      /**
       * * Timestamps
       */

      table.timestamp('createdAt', { useTz: true }).notNullable()
      table.timestamp('updatedAt', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
