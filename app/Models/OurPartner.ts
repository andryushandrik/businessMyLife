import Drive from '@ioc:Adonis/Core/Drive'
// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'

export default class OurPartner extends BaseModel {
	public static readonly columns = ['id', 'isVisible', 'name', 'image', 'link', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column({ serializeAs: null })
	public isVisible: boolean

	@column()
	public name: string

	@column()
	public image: string

	@column()
	public link: string

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

	/**
	 * * Hooks
	 */
	@beforeDelete()
	public static async deleteStoredImage(item: OurPartner) {
		if (item.image) await Drive.delete(item.image)
	}
}
