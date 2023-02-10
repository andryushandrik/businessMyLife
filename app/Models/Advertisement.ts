import Drive from '@ioc:Adonis/Core/Drive'
import { beforeDelete, BelongsTo, computed } from '@ioc:Adonis/Lucid/Orm'
// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User/User'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'

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

	@column.dateTime({ columnName: 'placed_untill' })
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

	@computed()
	public get placedAtForUser(): string {
		return this.placedAt ? this.placedAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT) : ''
	}

	@computed()
	public get placedUntillForUser(): string {
		return this.placedUntill ? this.placedUntill.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT) : ''
	}

	/**
	 * * Query scopes
	 */

	/**
	 * * Hooks
	 */

	@beforeDelete()
	public static async deleteStoredImage(item: Advertisement) {
		if (item.offerImage) await Drive.delete(item.offerImage)
		if (item.subsectionImage) await Drive.delete(item.subsectionImage)
	}
}

