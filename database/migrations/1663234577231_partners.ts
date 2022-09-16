import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.PARTNERS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      /**
       * Not nullable columns
       */
      table.string('title').notNullable()
      table.boolean('isTitleLink').notNullable().comment('Название кликабельное или нет')
      table.string('media').notNullable()
      table.integer('mediaType').unsigned().notNullable().comment('0 - изображение, 1 - видео')

      table.timestamp('createdAt', { useTz: true }).notNullable()
      table.timestamp('updatedAt', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
