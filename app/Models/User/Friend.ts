// * Types
import type User from './User'
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Friend extends BaseModel {
	public static readonly columns = [
		'id',
		'isRequest',
		'fromId',
		'toId',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public isRequest: boolean

	/**
	 * * Foreign keys
	 */

	@column({ columnName: 'from_id' })
	public fromId: User['id']

	@column({ columnName: 'to_id' })
	public toId: User['id']

	/**
	 * * Timestamps
	 */

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	/**
	 * * Query scopes
	 */

	public static getByRequest = scope((query, isRequest: Friend['isRequest']) => {
		query.where('isRequest', isRequest)
	})

	public static getByFromIdAndToId = scope((query, fromId: User['id'], toId: User['id']) => {
		query.where('from_id', fromId).andWhere('to_id', toId)
	})
}
