import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
	protected tableName = TABLES_NAMES.USERS

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			/**
			 * * Not nullable columns
			 */

			table.boolean('isShowEmail').defaultTo(1).notNullable().comment('Show email in profile page or not')
			table.boolean('isShowPhone').defaultTo(1).notNullable().comment('Show phone in profile page or not')

			table.integer('type').unsigned().notNullable().comment(`
        0 - физ лицо
        1 - ип
        2 - ооо
      `)

			table.string('firstName').notNullable()
			table.string('lastName').notNullable()

			table.string('email').notNullable()
			table.string('password').notNullable()

			/**
			 * * Nullable columns
			 */

			table.string('patronymic').nullable()
			table.date('birthday').nullable()
			table.string('city').nullable()
			table.string('phone').nullable()
			table.string('avatar').nullable()
			table.string('hobby').nullable()

			table.bigInteger('taxpayerIdentificationNumber').unique().unsigned().nullable().comment('ИНН')
			table.bigInteger('mainStateRegistrationNumber').unique().unsigned().nullable().comment('ОГРН или ОГРНИП у ИП')

			table.string('legalAddress').nullable()
			table.string('placeOfWork').nullable().comment('Отображается в профиле')
			table.string('companyName').nullable().comment('Указывается при регистрации и больше нигде не используется')
			table.integer('experienceType').nullable().comment(`
        0 - до 3 месяцев
        1 - от 3 до 6 месяцев
        2 - от 6 месяцев до 1 года
        3 - от 1 года до 3 лет
        4 - от 3 лет
      `)

			/**
			 * * Foreign keys
			 */

			table.integer('role_id').unsigned().notNullable().references(`${TABLES_NAMES.ROLES}.id`).onDelete('CASCADE')

			/**
			 * * Timestamps
			 */

			table.timestamp('createdAt', { useTz: true }).notNullable()
			table.timestamp('updatedAt', { useTz: true }).notNullable()

			table.timestamp('blockedUntil', { useTz: true }).nullable()
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
