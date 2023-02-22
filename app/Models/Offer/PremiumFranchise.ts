import { BelongsTo, computed, HasOne, hasOne, scope } from '@ioc:Adonis/Lucid/Orm'
// * Types
import Offer from './Offer'
import type { DateTime } from 'luxon'
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

	@computed()
	public get createdAtForUser(): string {
		if (this.createdAt) {
			return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
		}
		return ''
	}

	public static getByOfferId = scope((query, offerId: Offer['id']) => [query.where('offerId', offerId)])
}
