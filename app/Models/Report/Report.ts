// * Types
import type ReportType from './ReportType'
import type { DateTime } from 'luxon'
// * Types

import User from '../User/User'
import Offer from '../Offer/Offer'
import { BaseModel, BelongsTo, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Report extends BaseModel {
	public static readonly columns = ['id', 'description', 'userId', 'toId', 'offerId', 'reportTypeId', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public description: string

	/**
	 * * Foreign keys
	 */

	@column({ columnName: 'user_id' })
	public userId: User['id']

	@column({ columnName: 'reportType_id' })
	public reportTypeId: ReportType['id']

	@column({ columnName: 'to_id' })
	public toId: User['id']

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
	 * * Relations
	 */

	@belongsTo(() => Offer)
	public offer: BelongsTo<typeof Offer>

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@belongsTo(() => User, { foreignKey: 'toId', localKey: 'id' })
	public userTo: BelongsTo<typeof User>

	/**
	 * * Query scopes
	 */

	public static getByOffersIds = scope((query, offersIds: Offer['id'][]) => {
		query.whereIn('offer_id', offersIds)
	})

	public static getByUsersIds = scope((query, usersIds: User['id'][]) => {
		query.whereIn('user_id', usersIds)
	})

	public static getByUsersToIds = scope((query, usersIds: User['id'][]) => {
		query.whereIn('to_id', usersIds)
	})

	public static usersReports = scope((query) => {
		query.whereNotNull('to_id').andWhereNull('offer_id')
	})

	public static offersReports = scope((query) => {
		query.whereNotNull('offer_id').andWhereNull('to_id')
	})
}
