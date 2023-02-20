// * Types
import type { DateTime } from 'luxon'
// * Types
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, belongsTo, BelongsTo, column, computed, scope } from '@ioc:Adonis/Lucid/Orm'
import PremiumFranchise from './PremiumFranchise'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'

export default class PremiumSlot extends BaseModel {
	public static readonly table: string = TABLES_NAMES.PREMIUM_SLOTS
	public static readonly columns = [
		'id',
		'title',
		'type',
		'isBlocked',
		'priceThreeMonths',
		'priceSixMonths',
		'franchiseId',
		'employedAt',
		'employedUntill',
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
	public type: string // big | small

	@column()
	public image: string | null

	@column({ columnName: 'isBlocked' })
	public isBlocked: boolean

	@column()
	public priceThreeMonths: number

	@column()
	public priceSixMonths: number

	@column.dateTime({ columnName: 'employed_at' })
	public employedAt: DateTime

	@column.dateTime({ columnName: 'employed_untill' })
	public employedUntill: DateTime

	/**
	 * * Foreign keys
	 */

	@belongsTo(() => PremiumFranchise)
	public premiumFranchise: BelongsTo<typeof PremiumFranchise>

	@column({ columnName: 'franchise_id' })
	public franchiseId: PremiumFranchise['id'] | null

	/**
	 * * Timestamps
	 */

	@column.dateTime({ columnName: 'created_at', autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@computed()
	public get employedAtForUser(): string {
		if (this.employedAt) {
			return this.employedAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
		}
    return ''
	}

	@computed()
	public get employedUntillForUser(): string  {
		if (this.employedUntill) {
			return this.employedUntill.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
		}
    return ''
	}

	/**
	 * * Hooks
	 */

	public static search = scope((query, searchQuery: string) => {
		query.where('title', 'ILIKE', `%${searchQuery}%`)
	})
}

