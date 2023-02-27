import { scope } from '@ioc:Adonis/Lucid/Orm'
// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AdvertisementType extends BaseModel {
	public static readonly table = 'advertisements_types'
	public static readonly columns = ['id', 'priceThreeMonths', 'priceSixMonths', 'status', 'place', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column({ columnName: 'priceThreeMonths' })
	public priceThreeMonths: number

	@column({ columnName: 'priceSixMonths' })
	public priceSixMonths: number

	@column({ columnName: 'status' })
	public status: string

	@column({ columnName: 'place' })
	public place: string

	@column.dateTime({ autoCreate: true, columnName: 'created_at' })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
	public updatedAt: DateTime
	/**
	 * * Computed properties
	 */

	/**
	 * * Query scopes
	 */
	public static getByPlace = scope((query, place: string) => {
		query.where('place', place)
	})

	/**
	 * * Hooks
	 */
}
