// * Types
import type User from '../User/User'
import type { DateTime } from 'luxon'
import type { BelongsTo, HasMany, HasOne, ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Message from './Message'
import Offer from '../Offer/Offer'
import UserService from 'App/Services/User/UserService'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, hasMany, hasOne, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Conversation extends BaseModel {
	public static readonly columns = ['id', 'fromId', 'toId', 'offerId', 'createdAt', 'updatedAt'] as const

	/**
	 * * Columns
	 */

	@column({ isPrimary: true })
	public id: number

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
	 * * Relations
	 */



	@hasOne(() => Message, {
		onQuery(query) {
			query.orderBy('id', 'desc')
		},
	})
	public lastMessage: HasOne<typeof Message>

	@hasMany(() => Message)
	public messages: HasMany<typeof Message>

	/**
	 * * Query scopes
	 */

	public static getById = scope((query, id: Conversation['id']) => {
		query.where('id', id)
	})

	public static getUserConversations = scope((query, userId: User['id']) => {
		query.where((query) => {
			query.where('from_id', userId).orWhere('to_id', userId)
		})
	})

	public static getWithoutTopic = scope((query, fromId: User['id'], toId: User['id']) => {
		query.whereNull('offer_id').andWhere((query) => {
			query.whereIn(['from_id', 'to_id'], [[fromId, toId]]).orWhereIn(['from_id', 'to_id'], [[toId, fromId]])
		})
	})

	public static getWithOfferTopic = scope((query, fromId: User['id'], toId: User['id'], offerId: Offer['id']) => {
		query.where('offer_id', offerId).andWhere((query) => {
			query.whereIn(['from_id', 'to_id'], [[fromId, toId]]).orWhereIn(['from_id', 'to_id'], [[toId, fromId]])
		})
	})

	public static countNewMessagesForCurrentUser = scope((query: ModelQueryBuilderContract<typeof Conversation>, userId: User['id']) => {
		query.withCount('messages', (query) => {
			query
				.withScopes((scopes) => scopes.getNew())
				.withScopes((scopes) => scopes.notCurrentUser(userId))
				.as('newMessagesCount')
		})
	})

	public static getByUsersIds = scope((query, fromId: User['id'], toId: User['id']) => {
		query
			// .whereNull('lot_id')
			.andWhere((query) => {
				query
					.whereIn(['from_id', 'to_id'], [[fromId, toId]])
					.orWhereIn(['from_id', 'to_id'], [[toId, fromId]])
			})
	})

	/**
	 * * Hooks
	 */

	@beforeFind()
	@beforeFetch()
	public static preloadAndAggregateModels(query: ModelQueryBuilderContract<typeof Conversation>) {
		query.preload('lastMessage')
	}

	/**
	 * * Other methods
	 */

	public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
		const item: ModelObject = { ...this.toJSON() }
		const actualUserId: User['id'] = this.fromId == currentUserId ? this.toId : this.fromId
		item.user = await UserService.get(Number(actualUserId))
		item.newMessagesCount = this.$extras.newMessagesCount
		return item
	}
}
