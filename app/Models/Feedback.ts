// * Types
import type { DateTime } from 'luxon'
// * Types

import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { BaseModel, column, computed, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Feedback extends BaseModel {
	public static readonly columns = [
		'id',
		'name',
		'email',
		'question',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public isCompleted: boolean

	@column()
	public name: string

	@column()
	public email: string

	@column()
	public question: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	/**
	 * * Computed properties
	 */

	@computed()
	public get isCompletedForUser(): string {
		return this.isCompleted ? 'Да' : 'Нет'
	}

	@computed()
	public get createdAtForUser(): string {
		return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
	}

	/**
	 * * Query scopes
	 */

	public static search = scope((query, searchQuery: string) => {
		query.where('name', 'ILIKE', `%${searchQuery}%`)
	})
}
