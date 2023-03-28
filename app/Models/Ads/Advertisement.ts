import Subsection from 'App/Models/Offer/Subsection'
import Drive from '@ioc:Adonis/Core/Drive'
import { afterFetch, afterFind, beforeDelete, BelongsTo, computed, scope } from '@ioc:Adonis/Lucid/Orm'
// * Types
import { DateTime } from 'luxon'
// * Types

import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from '../User/User'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import AdvertisementType from './AdvertisementType'

export default class Advertisement extends BaseModel {
	public static readonly columns = [
		'id',
		'image',
		'subsectionId',
		'link',
		'adsTypeId',
		'userId',
		'description',
		'placedAt',
		'placedForMonths',
		'isVerified',
		'viewsCount',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column({ columnName: 'image' })
	public image: string

	@column({ columnName: 'ads_type_id' })
	public adsTypeId: number

	@column({ columnName: 'subsection_id' })
	public subsectionId: Subsection['id']

	@column()
	public description: string

	@column()
	public link: string

	@column({ columnName: 'user_id' })
	public userId: User['id']

	@column({ columnName: 'isVerified' })
	public isVerified: boolean

  @column({ columnName: 'isArchived' })
	public isArchived: boolean

	@column({ columnName: 'viewsCount' })
	public viewsCount: number

	@column.dateTime({ autoCreate: true, columnName: 'placed_at' })
	public placedAt: DateTime

	@column({ columnName: 'placedForMonths' })
	public placedForMonths: number

	@column.dateTime({ autoCreate: true, columnName: 'created_at' })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
	public updatedAt: DateTime

	@belongsTo(() => User)
	public owner: BelongsTo<typeof User>

	@belongsTo(() => Subsection)
	public subsection: BelongsTo<typeof Subsection>

	@belongsTo(() => AdvertisementType, { foreignKey: 'adsTypeId' })
	public adsType: BelongsTo<typeof AdvertisementType>

	/**
	 * * Computed properties
	 */
	@computed()
	public get placedUntill(): string {
		const expireDate: DateTime = this.placedAt.plus({ months: this.placedForMonths })
		//  const archiveExpireInDays: number = expireDate.diff(DateTime.now(), 'days').days
		//  const archiveExpireInDaysWithoutFraction: number = Math.floor(archiveExpireInDays)

		return `${expireDate.setLocale('ru-RU').toFormat('dd MMMM, yyyy ')}`
	}

	@computed()
	public get placedAtForUser(): string {
		return this.placedAt ? this.placedAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT) : ''
	}

	@computed()
	public get placedUntillForUser(): string {
		const expireDate: DateTime = this.placedAt.plus({ months: this.placedForMonths })
		return this.placedUntill ? expireDate.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT) : ''
	}

	@computed()
	public get placedUntillForPicker(): string {
		const expireDate: DateTime = this.placedAt.plus({ months: this.placedForMonths })
		return this.placedUntill ? expireDate.toFormat('dd MMMM, yyyy') : ''
	}

	/**
	 * * Query scopes
	 */

	public static getBySubsectionId = scope((query, subsectionId: number) => {
		query.where('subsectionId', subsectionId)
	})

	public static getByIsVerified = scope((query, isVerified: boolean) => {
		query.where('isVerified', isVerified)
	})

	public static getByUserId = scope((query, userId: number) => {
		query.where('userId', userId)
	})
	public static getByQuery = scope((query, searchString: string) => {
		query.where('description', 'ILIKE', `%${searchString}%`)
	})

	/**
	 * * Hooks
	 */



	@afterFind()
	public static afterFindHook(advertisement: Advertisement) {
		const expireDate: DateTime = advertisement.createdAt.plus({ months: advertisement.placedForMonths })
		const expiresInMilliseconds: number = expireDate.diff(DateTime.now()).milliseconds
		if (expiresInMilliseconds < 0) {
			advertisement.delete()
		}
	}

	@afterFetch()
	public static afterFetchHook(advertisements: Advertisement[]) {
		advertisements.map((advertisement) => {
			const expireDate: DateTime = advertisement.createdAt.plus({ months: advertisement.placedForMonths })
			const expiresInMilliseconds: number = expireDate.diff(DateTime.now()).milliseconds
			if (expiresInMilliseconds < 0) {
				advertisement.delete()
			}
		})
	}

	@beforeDelete()
	public static async deleteStoredImage(item: Advertisement) {
		if (item.image) await Drive.delete(item.image)
	}
}

