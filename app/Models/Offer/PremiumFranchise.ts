// * Types
import type Offer from './Offer'
import type { DateTime } from 'luxon'
// * Types
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	/**
	 * * Hooks
	 */
}
