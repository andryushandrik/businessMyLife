// * Types
import type { DateTime } from 'luxon'
// * Types

import Drive from '@ioc:Adonis/Core/Drive'
import { BaseModel, beforeDelete, column, computed, scope } from '@ioc:Adonis/Lucid/Orm'

export default class UploadTutorial extends BaseModel {
	public static readonly columns = ['id', 'isVisible', 'isEmbed', 'isTitleLink', 'title', 'media', 'link', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column({ serializeAs: null })
	public isVisible: boolean

	@column()
	public isEmbed: boolean

	@column()
	public isTitleLink: boolean

	@column()
	public link: string

	@column()
	public title: string

	@column()
	public media: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	/**
	 * * Computed properties
	 */

	@computed()
	public get isVisibleForUser(): string {
		return this.isVisible ? 'Отображается' : 'Не отображается'
	}

	/**
	 * * Query scopes
	 */

	public static search = scope((query, searchQuery: string) => {
		query.where('title', 'ILIKE', `%${searchQuery}%`)
	})

	/**
	 * * Hooks
	 */

	@beforeDelete()
	public static async deleteStoredImage(item: UploadTutorial) {
		if (item.media) await Drive.delete(item.media)
	}
}
