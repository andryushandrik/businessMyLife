import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import { TABLES_NAMES, NEWS_DESCRIPTION_MAX_LENGTH } from "Config/database";

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.NEWS;

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      /**
       * Not nullable collumns
       */

      table.string('title').notNullable()
      table.string('description', NEWS_DESCRIPTION_MAX_LENGTH).notNullable()
      table.integer('viewsCount').unsigned().notNullable()

      /**
       * Nullable collumns
       */

      table.string('slug').unique()
      table.string('suptitle')
      table.string('image')
      table.integer('readingTimeFrom').unsigned()
      table.integer('readingTimeTo').unsigned()

      /**
       * Timestamps
       */

       table.timestamp('createdAt', { useTz: true }).notNullable()
       table.timestamp('updatedAt', { useTz: true }).notNullable()
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
