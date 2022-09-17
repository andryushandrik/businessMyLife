import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { FEEDBACK_QUESTION_MAX_LENGTH, TABLES_NAMES } from '../../config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.FEEDBACKS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('isCompleted').defaultTo(0).notNullable().comment(`
        0 - не обработано
        1 - обработано
      `)
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('question', FEEDBACK_QUESTION_MAX_LENGTH).notNullable()

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
