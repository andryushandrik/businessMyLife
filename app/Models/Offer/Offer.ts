import PremiumFranchise from 'App/Models/Offer/PremiumFranchise'
// * Types
import type { Err } from 'Contracts/response'
import { afterFetch, afterFind, BelongsTo, HasMany, HasOne, hasOne, ModelObject } from '@ioc:Adonis/Lucid/Orm'
// * Types

import User from '../User/User'
import Report from '../Report/Report'
import Subsection from './Subsection'
import OfferImage from './OfferImage'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { TABLES_NAMES } from 'Config/database'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { formatStringForCyrillic } from 'Helpers/index'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { OfferCategories, OfferPaybackTimes, OfferProjectStages, OFFER_CATEGORIES, OFFER_PAYBACK_TIMES, OFFER_PROJECT_STAGES } from 'Config/offer'
import { BaseModel, beforeDelete, beforeSave, belongsTo, column, computed, hasMany, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Offer extends BaseModel {
	public static readonly columns = [
		'id',
		'isBanned',
		'isArchived',
		'isVerified',
		'viewsCount',
		'slug',
		'title',
		'description',
		'city',
		'image',
		'video',
		'category',
		'paybackTime',
		'cooperationTerms',
		'businessPlan',
		'benefits',
		'about',
		'aboutCompany',
		'investments',
		'projectStage',
		'dateOfrCreation',
		'price',
		'pricePerMonth',
		'profitPerMonth',
		'profit',
		'branchCount',
		'soldBranchCount',
		'blockDescription',
		'placedForMonths',
		'userId',
		'subsectionId',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column({ serializeAs: null })
	public isBanned: boolean

	@column()
	public isArchived: boolean

	@column()
	public isVerified: boolean

	@column()
	public viewsCount: number

	@column()
	public slug: string

	@column()
	public title: string

	@column()
	public description: string

	@column()
	public city: string

	@column()
	public category: number

	@column()
	public image?: string

	@column()
	public video?: string

	@column()
	public cooperationTerms?: string

	@column()
	public businessPlan?: string

	@column()
	public benefits?: string

	@column()
	public about?: string

	@column()
	public aboutCompany?: string

	@column()
	public paybackTime?: number | null

	@column()
	public projectStage?: number

	@column()
	public investments?: number

	@column.date()
	public dateOfCreation?: DateTime

	@column()
	public price?: number

	@column()
	public pricePerMonth?: number

	@column({ columnName: 'isPricePerMonthAbsolute' })
	public isPricePerMonthAbsolute?: boolean

	@column()
	public profitPerMonth?: number

	@column()
	public profit?: number

	@column()
	public branchCount?: number

	@column()
	public soldBranchCount?: number

	@column()
	public blockDescription?: string | null

	/**
	 * * Foreign keys
	 */

	@column({ columnName: 'user_id' })
	public userId: User['id']

	@column({ columnName: 'subsection_id' })
	public subsectionId: Subsection['id']

	/**
	 * * Timestamps
	 */

	@column()
	public placedForMonths: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	/**
	 * * Aggregates columns
	 */

	@column({ columnName: 'reports_count' })
	public reportsCount?: number

	/**
	 * * Relations
	 */

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@belongsTo(() => Subsection)
	public subsection: BelongsTo<typeof Subsection>

	@hasMany(() => OfferImage)
	public images: HasMany<typeof OfferImage>

	@hasMany(() => Report)
	public reports: HasMany<typeof Report>

	@hasOne(() => PremiumFranchise)
	public premiumFranchise: HasOne<typeof PremiumFranchise>

	/**
	 * * Computed properties
	 */

	@computed()
	public get isArchivedForUser(): string {
		return this.isArchived ? 'Да' : 'Нет'
	}

	@computed()
	public get isBannedForUser(): string {
		return this.isBanned ? 'Да' : 'Нет'
	}

	@computed()
	public get isBlocked(): boolean {
		let isOfferBlocked = false
		if (this.blockDescription) {
			isOfferBlocked = true
		}
		return isOfferBlocked
	}

	@computed()
	public get isVerifiedForUser(): string {
		return this.isVerified ? 'Да' : 'Нет'
	}

	@computed()
	public get categoryForUser(): string {
		return OFFER_CATEGORIES[this.category]
	}

	@computed()
	public get paybackTimeForUser(): string {
		if (this.paybackTime !== undefined && this.paybackTime !== null) return OFFER_PAYBACK_TIMES[this.paybackTime]

		return ''
	}

	@computed()
	public get projectStageForUser(): string {
		if (this.projectStage !== undefined) return OFFER_PROJECT_STAGES[this.projectStage]

		return ''
	}

	@computed()
	public get createdAtForUser(): string {
		return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
	}

	@computed()
	public get timeBeforeArchive(): string {
		const expireDate: DateTime = this.createdAt.plus({ months: this.placedForMonths })
		if (this.isArchived) {
			return ` Архивирован ${expireDate.setLocale('ru-RU').toFormat('dd MMMM, yyyy')}`
		}
		const daysBeforeArchive: number = expireDate.diff(DateTime.now(), 'days').days
		const daysBeforeArchiveWithoutFraction: number = Math.floor(daysBeforeArchive)

		return `Осталось ${daysBeforeArchiveWithoutFraction} дней - до ${expireDate.setLocale('ru-RU').toFormat('dd MMMM, yyyy')}`
	}

	/**
	 * * Query scopes
	 */

	public static getPayloadInfo = scope((query) => {
		// WHERE payment_target LIKE '%${Offer.table}%'
		// const joinQuery = query.joinRaw(`JOIN payments
		// ON ${this.table}.id = substring(payments.payment_target from '[0-9]+$')::int AND payment_target LIKE '%${this.table}%`)
		const joinQuery = query.join('payments', (query) => {
			query.on(`${this.table}.id`, `payments.target_id`).andOn(`${this.table}`, `payments.target_table`)
		})

		return [joinQuery]
	})

	public static getByArchived = scope((query, isArchived: Offer['isArchived']) => [query.where('isArchived', isArchived)])

	public static getByCategories = scope((query, categories: OfferCategories[]) => [query.whereIn('category', categories)])

	public static getByProjectStages = scope((query, projectStages: OfferProjectStages[]) => [query.whereIn('projectStage', projectStages)])

	public static getByPaybackTimes = scope((query, paybackTime: OfferPaybackTimes[]) => [query.whereIn('paybackTime', paybackTime)])

	public static getByCity = scope((query, city: Offer['city']) => [query.where('city', 'ILIKE', `${city}%`)])

	public static getByVerified = scope((query, isVerified: Offer['isVerified']) => [query.where('isVerified', isVerified)])

	public static getByBanned = scope((query, isBanned: Offer['isBanned']) => [query.where('isBanned', isBanned)])

	public static getByInvestmentsFrom = scope((query, from: number) => [query.where('investments', '>=', from)])

	public static getByInvestmentsTo = scope((query, to: number) => [query.where('investments', '<=', to)])

	public static getByPriceFrom = scope((query, from: number) => [query.where('price', '>=', from)])

	public static getByPriceTo = scope((query, to: number) => [query.where('price', '<=', to)])

	public static getByProfitFrom = scope((query, from: number) => [query.where('profit', '>=', from)])

	public static getByProfitTo = scope((query, to: number) => [query.where('profit', '<=', to)])

	public static getByProfitPerMonthFrom = scope((query, from: number) => [query.where('profitPerMonth', '>=', from)])

	public static getByProfitPerMonthTo = scope((query, to: number) => [query.where('profitPerMonth', '<=', to)])

	public static getByUserId = scope((query, userId: User['id']) => [query.where('user_id', userId)])

	public static getBySubsectionsIds = scope((query, subsectionsIds: Subsection['id'][]) => {
		query.whereIn('subsection_id', subsectionsIds)
	})

	public static search = scope((query, searchQuery: string) => {
		query.where('title', 'ILIKE', `%${searchQuery}%`)
	})

	/**
	 * * Hooks
	 */

	@beforeSave()
	public static formatSlug(item: Offer) {
		const today: number = DateTime.now().day

		if (item.$dirty.slug) item.slug = formatStringForCyrillic(item.slug, 'snakeCase', '_')

		if (!item.slug) item.slug = formatStringForCyrillic(`${item.title}_${today}`, 'snakeCase', '_')
	}

	@beforeDelete()
	public static async deleteStoredImage(item: Offer) {
		if (item.image) await Drive.delete(item.image)
	}

	@afterFind()
	public static afterFindHook(offer: Offer) {
		const expireDate: DateTime = offer.createdAt.plus({ months: offer.placedForMonths })
		const expiresInMilliseconds: number = expireDate.diff(DateTime.now()).milliseconds
		if (expiresInMilliseconds < 0) {
			offer.isArchived = true
			offer.save()
		}
	}

	@afterFetch()
	public static afterFetchHook(offers: Offer[]) {
		offers.map((offer) => {
			const expireDate: DateTime = offer.createdAt.plus({ months: offer.placedForMonths })
			const expiresInMilliseconds: number = expireDate.diff(DateTime.now()).milliseconds
			if (expiresInMilliseconds < 0) {
				offer.isArchived = true
				offer.save()
			}
		})
	}

	/**
	 * * Other
	 */

	public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
		const item: ModelObject = { ...this.serialize() }

		try {
			const isFavorite = await Database.from(TABLES_NAMES.FAVORITE_OFFERS).where('user_id', currentUserId).andWhere('offer_id', item.id).first()

			item.isFavorite = Boolean(isFavorite)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		return item
	}
}
