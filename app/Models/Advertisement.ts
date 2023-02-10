import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User/User'

export default class Advertisement extends BaseModel {
	public static readonly columns = [
		'id',
		'offerImage',
		'subsectionImage',
		'paymentStatus',
		'userId',
		'description',
		'placedAt',
		'placedUntill',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column({ columnName: 'offer_image' })
	public offerImage: string

	@column({ columnName: 'subsection_image' })
	public subsectionImage: string

	@column()
	public description: string

	@column({ columnName: 'payment_status' })
	public paymentStatus: string

	@column({ columnName: 'user_id' })
	public userId: User['id']

	@column.dateTime({ autoCreate: true, columnName: 'placed_at' })
	public placedAt: DateTime

	@column.dateTime({ columnName: 'placed_untill'})
	public placedUntill: DateTime

	@column.dateTime({ autoCreate: true, columnName: 'created_at' })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
	public updatedAt: DateTime

	@belongsTo(() => User)
	public owner: BelongsTo<typeof User>

	/**
	 * * Computed properties
	 */
	/**
	 * * Query scopes
	 */

	/**
	 * * Hooks
	 */

	// @beforeDelete()
	// public static async deleteStoredImage(item: Advertisement) {
	// 	if (item.image) await Drive.delete(item.image)
	// }
}

