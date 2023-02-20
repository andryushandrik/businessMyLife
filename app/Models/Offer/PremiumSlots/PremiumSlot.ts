// * Types
import type { DateTime } from 'luxon'
// * Types
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'
import PremiumFranchise from '../PremiumFranchise'

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

	@column({ columnName: 'franchise_id' })
	public franchiseId: PremiumFranchise['id']

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
	public static search = scope((query, searchQuery: string) => {
		query.where('title', 'ILIKE', `%${searchQuery}%`)
	})
}
