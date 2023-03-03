import PromoCode from 'App/Models/PromoCode'
import { BelongsTo, scope } from '@ioc:Adonis/Lucid/Orm'
// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User/User'

export default class Payment extends BaseModel {
	public static readonly columns = ['id', 'amount', 'description', 'promocodeId', 'createdAt', 'updatedAt'] as const

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
	public promocodeId?: PromoCode['id'] | null

	@column()
	public amount: number

	@column({ columnName: 'payment_target' })
	public paymentTarget: string

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
	/**
	 * * Hooks
	 */
}

