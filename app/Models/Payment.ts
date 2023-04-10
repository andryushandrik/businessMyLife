import PromoCode from 'App/Models/PromoCode'
import { BelongsTo, computed, LucidModel, scope } from '@ioc:Adonis/Lucid/Orm'
// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User/User'

export default class Payment extends BaseModel {
	public static readonly columns = ['id', 'amount', 'description', 'promoCodeId', 'target_table', 'target_id', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public description: string

	@column()
	public method: string

	@column()
	public status: string

	@column({ columnName: 'user_id' })
	public userId: User['id']

	@column({ columnName: 'promocode_id' })
	public promoCodeId?: PromoCode['id'] | null

	@column()
	public amount: number

	@column({ columnName: 'target_table' })
	public targetTable: string

	@column({ columnName: 'target_id' })
	public targetId: number

	@column.dateTime({ autoCreate: true, columnName: 'created_at' })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
	public updatedAt: DateTime

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@belongsTo(() => PromoCode)
	public promoCode: BelongsTo<typeof PromoCode>

	/**
	 * * Computed properties
	 */

	/**
	 * * Query scopes
	 */
	public static search = scope((query, searchQuery: string) => {
		query.where('description', 'ILIKE', `%${searchQuery}%`)
	})

	public static getByPaymentTarget = scope((query, model: LucidModel, id: number) => {
		query.where('target_table', `${model.table}`).andWhere('target_id', `${id}`)
	})

	@computed()
	public get createdAtForUser(): string {
		return this.createdAt.setLocale('ru-RU').toFormat('dd.LL.yyyy, HH:mm.ss')
	}
	/**
	 * * Hooks
	 */
}
