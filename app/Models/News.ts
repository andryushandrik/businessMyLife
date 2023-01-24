// * Types
import type { DateTime } from 'luxon'
// * Types

import Drive from '@ioc:Adonis/Core/Drive'
import { formatStringForCyrillic } from 'Helpers/index'
import { BaseModel, column, beforeSave, beforeDelete } from '@ioc:Adonis/Lucid/Orm'

export default class News extends BaseModel {
	public static readonly columns = [
		'id',
		'slug',
		'title',
		'description',
		'suptitle',
		'image',
		'viewsCount',
		'readingTimeFrom',
		'readingTimeTo',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public slug: string

	@column()
	public title: string

	@column()
	public description: string

	@column()
	public viewsCount: number

	@column()
	public suptitle?: string

	@column()
	public image?: string

	@column()
	public readingTimeFrom?: number

	@column()
	public readingTimeTo?: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	/**
	 * * Hooks
	 */

	@beforeSave()
	public static formatSlug(item: News) {
		if (item.$dirty.slug) item.slug = formatStringForCyrillic(item.slug, 'snakeCase', '_')

		if (!item.slug) item.slug = formatStringForCyrillic(item.title, 'snakeCase', '_')
	}

	@beforeDelete()
	public static async deleteStoredImage(item: News) {
		if (item.image) await Drive.delete(item.image)
	}
}
