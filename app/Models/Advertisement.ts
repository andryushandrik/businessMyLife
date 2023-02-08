// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Advertisement extends BaseModel {
	public static readonly columns = ['id', 'image', 'description', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public image: string

	@column()
	public description: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

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
