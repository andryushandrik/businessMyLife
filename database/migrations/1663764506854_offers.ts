import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import {
  OFFER_ABOUT_COMPANY_MAX_LENGTH, OFFER_ABOUT_MAX_LENGTH, OFFER_BENEFITS_MAX_LENGTH,
  OFFER_BLOCK_DESCRIPTION_MAX_LENGTH, OFFER_BUSINESS_PLAN_MAX_LENGTH, OFFER_COOPERATION_TERMS_MAX_LENGTH,
  OFFER_DESCRIPTION_MAX_LENGTH, TABLES_NAMES
} from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.OFFERS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('isBanned').defaultTo(0).notNullable()
      table.boolean('isArchived').defaultTo(1).notNullable()
      table.boolean('isVerified').defaultTo(0).notNullable()
      table.integer('viewsCount').unsigned().defaultTo(0).notNullable()

      table.string('slug').unique().notNullable()
      table.string('title').notNullable()
      table.string('description', OFFER_DESCRIPTION_MAX_LENGTH).notNullable().comment('У всех категорий это поле описание объявления, у продажи готового бизнеса это поле описание бизнеса, у франшиз это поле описание франшизы')
      table.string('city').notNullable()

      table.integer('category').unsigned().notNullable().comment(`
        0 - поиск инвесторов
        1 - предложения инвесторов
        2 - поиск бизнес партнеров
        3 - продажа готового бизнеса
        4 - франшизы
      `)

      /**
       * * Nullable columns
       */

      table.string('image').nullable()
      table.string('video').nullable().comment('Embed video, only for franchises')

      table.string('cooperationTerms', OFFER_COOPERATION_TERMS_MAX_LENGTH).nullable().comment('Условия сотрудничества, у продажи готового бизнеса это поле условия продажи')
      table.string('businessPlan', OFFER_BUSINESS_PLAN_MAX_LENGTH).nullable().comment('Бизнес план (все кроме предложения инвесторов)')
      table.string('benefits', OFFER_BENEFITS_MAX_LENGTH).nullable().comment('Есть только у франшиз')

      table.string('about', OFFER_ABOUT_MAX_LENGTH).nullable().comment('О себе (поиск инвесторов, предложения инвесторов, поиск бизнес партнера)')
      table.string('aboutCompany', OFFER_ABOUT_COMPANY_MAX_LENGTH).nullable().comment('Есть только у франшиз')

      table.integer('paybackTime').unsigned().nullable().comment(`
        Срок окупаемости
        0 - до 3 месяцев
        1 - от 3 до 6 месяцев
        2 - от 6 месяцев до 1 года
        3 - от 1 года до 3 лет
        4 - от 3 лет
      `)
      table.integer('projectStage').unsigned().nullable().comment(`
        Стадия проекта (присутствует у всех кроме предложений инвесторов и франшиз)
        0 - Идея
        1 - В стадии создания
        2 - Готовый бизнес
      `)

      table.integer('investments').unsigned().nullable().comment('Инвестиции (есть во всех категориях кроме готового бизнеса)')
      table.date('dateOfCreation').nullable().comment('Есть только у франшиз')

      table.integer('price').unsigned().nullable().comment('Есть только у продажи готового бизнеса и франшизы')
      table.integer('pricePerMonth').unsigned().nullable().comment('Есть только у франшиз')

      table.integer('profitPerMonth').unsigned().nullable()
      table.integer('profit').unsigned().nullable().comment('Есть только у продажи готового бизнеса и франшизы')

      table.integer('branchCount').unsigned().nullable().comment('Есть только у продажи готового бизнеса и франшизы')
      table.integer('soldBranchCount').unsigned().nullable().comment('Есть только у франшиз')

      table.string('blockDescription', OFFER_BLOCK_DESCRIPTION_MAX_LENGTH).nullable().comment('Причина блокировки')

      /**
       * * Foreign keys
       */

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.USERS}.id`)
        .onDelete('CASCADE')

      table
        .integer('subsection_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.SUBSECTIONS}.id`)
        .onDelete('CASCADE')

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
