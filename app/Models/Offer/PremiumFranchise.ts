import { BelongsTo, computed, HasMany, hasMany, HasOne, scope } from '@ioc:Adonis/Lucid/Orm'
// * Types
import Offer from './Offer'
import { DateTime } from 'luxon'
// * Types
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import PremiumSlot from './PremiumSlot'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'

export default class PremiumFranchise extends BaseModel {
	public static readonly table: string = TABLES_NAMES.PREMIUM_FRANCHISES
	public static readonly columns = ['id', 'offerId', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column({ columnName: 'placedForMonths' })
	public placedForMonths: number
	/**
	 * * Foreign keys
	 */

	@column({ columnName: 'offer_id' })
	public offerId: Offer['id']

	/**
	 * * Timestamps
	 */

	@column.dateTime({ autoCreate: true, columnName: 'created_at' })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
	public updatedAt: DateTime

	@belongsTo(() => Offer)
	public offer: BelongsTo<typeof Offer>

	@hasMany(() => PremiumSlot, { foreignKey: 'franchiseId' })
	public premiumSlots: HasMany<typeof PremiumSlot>
	/**
	 * * Hooks
	 */

	@computed()
	public get createdAtForUser(): string {
		if (this.createdAt) {
			return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
		}
		return ''
	}

	@computed()
	public get archiveExpire(): string {
		const expireDate: DateTime = this.createdAt.plus({ months: this.placedForMonths })
		const archiveExpireInDays: number = expireDate.diff(DateTime.now(), 'days').days
		const archiveExpireInDaysWithoutFraction: number = Math.floor(archiveExpireInDays)

		return `Осталось ${archiveExpireInDaysWithoutFraction} дней - до ${expireDate.setLocale('ru-RU').toFormat('dd MMMM, yyyy')}`
	}

	public static getByOfferId = scope((query, offerId: Offer['id']) => [query.where('offerId', offerId)])
}
