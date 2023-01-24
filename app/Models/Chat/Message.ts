// * Types
import type User from '../User/User'
import type Conversation from './Conversation'
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Message extends BaseModel {
	public static readonly columns = [
		'id',
		'isViewed',
		'text',
		'userId',
		'conversationId',
		'createdAt',
		'updatedAt',
	] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

	@column()
	public text: string

	@column()
	public isViewed: boolean

	/**
	 * * Foreign keys
	 */

	@column({ columnName: 'user_id' })
	public userId: User['id']

	@column({ columnName: 'conversation_id' })
	public conversationId: Conversation['id']

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

	public static getNew = scope((query) => {
		query.where('isViewed', false)
	})

	public static notCurrentUser = scope((query, userId: User['id']) => {
		query.whereNot('user_id', userId)
	})
}
