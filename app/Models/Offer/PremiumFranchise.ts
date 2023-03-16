import { afterFetch, afterFind, BelongsTo, computed, HasOne, hasOne, scope } from '@ioc:Adonis/Lucid/Orm'
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

	@hasOne(() => PremiumSlot, { foreignKey: 'franchiseId' })
	public premiumSlot: HasOne<typeof PremiumSlot>

	/**
	 * * Hooks
	 */

	@afterFind()
	public static afterFindHook(premiumFranchise: PremiumFranchise) {
		const expireDate: DateTime = premiumFranchise.createdAt.plus({ months: premiumFranchise.placedForMonths })
		const expiresInMilliseconds: number = expireDate.diff(DateTime.now()).milliseconds
		if (expiresInMilliseconds < 0) {
			premiumFranchise.delete()
		}
	}

	@afterFetch()
	public static afterFetchHook(premiumFranchises: PremiumFranchise[]) {
		premiumFranchises.map((premiumFranchise) => {
			const expireDate: DateTime = premiumFranchise.createdAt.plus({ months: premiumFranchise.placedForMonths })
			const expiresInMilliseconds: number = expireDate.diff(DateTime.now()).milliseconds
			if (expiresInMilliseconds < 0) {
				premiumFranchise.delete()
			}
		})
	}

	@computed()
	public get createdAtForUser(): string {
		if (this.createdAt) {
			return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
		}
		return ''
	}

	@computed()
	public get timeBeforeArchive(): string {
		const expireDate: DateTime = this.createdAt.plus({ months: this.placedForMonths })
		const daysBeforeArchive: number = expireDate?.diff(DateTime.now(), 'days').days
		const daysBeforeArchiveWithoutFraction: number = Math.floor(daysBeforeArchive)

		return `Осталось ${daysBeforeArchiveWithoutFraction} дней - до ${expireDate?.setLocale('ru-RU').toFormat('dd MMMM, yyyy')}`
	}

	public static getByOfferId = scope((query, offerId: Offer['id']) => [query.where('offerId', offerId)])

  public static getByQuery = scope((query, searchString: string) => [query.where('offerId',searchString)])


	public static getPaymentInfo = scope((query) => {
		const joinQuery = query.leftJoin('payments', (query) => {
			query.on(`${this.table}.id`, `payments.target_id`).andOnVal(`payments.target_table`, '=', 'premium_franchises')
		})
		return [joinQuery]
	})
}
