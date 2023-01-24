// * Types
import type { DateTime } from 'luxon'
// * Types

import Drive from '@ioc:Adonis/Core/Drive'
import { BaseModel, column, beforeDelete } from '@ioc:Adonis/Lucid/Orm'

export default class Banner extends BaseModel {
	public static readonly columns = [
		'id',
		'title',
		'description',
		'image',
		'link',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public title: string

	@column()
	public description: string

	@column()
	public image: string

	@column()
	public link?: string | null

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	/**
	 * * Hooks
	 */

	@beforeDelete()
	public static async deleteStoredImage(item: Banner) {
		await Drive.delete(item.image)
	}
}
