// * Types
import User from '../User/User'
import type Conversation from './Conversation'
import type { DateTime } from 'luxon'
// * Types

import {
	BaseModel,
	beforeFetch,
	beforeFind,
	beforePaginate,
	belongsTo,
	BelongsTo,
	column,
	computed,
	ModelQueryBuilderContract,
	scope,
} from '@ioc:Adonis/Lucid/Orm'
import Offer from '../Offer/Offer'

export default class Message extends BaseModel {
	public static readonly columns = ['id', 'isViewed', 'text', 'userId', 'conversationId', 'createdAt', 'updatedAt'] as const

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

	@belongsTo(() => User, { serializeAs: null })
	public user: BelongsTo<typeof User>

	/**
	 * * Computed properties
	 */

	@computed()
	public get userAvatar(): string {
		if (!this.user || !this.user.avatar) return ''
		return this.user.avatar!
	}

	@computed()
	public get userName(): string {
		if (!this.user || !this.user.firstName) return ''
		return this.user.firstName!
	}

	@computed()
	public get offerInfo(): object {
		if (!this.offer) return {}
		const title = this.offer.title,
			price = this.offer.price

		return { title, price }
	}

	/**
	 * * Query scopes
	 */

	public static getNew = scope((query) => {
		query.where('isViewed', false)
	})

	public static notCurrentUser = scope((query, userId: User['id']) => {
		query.whereNot('user_id', userId)
	})

	/**
	 * * Hooks
	 */

	@beforeFetch()
	@beforeFind()
	public static preloadUser(query: ModelQueryBuilderContract<typeof Message>) {
		query.preload('user')
		query.preload('offer')
	}

	@beforePaginate()
	public static preloadUsers([countQuery, query]: [ModelQueryBuilderContract<typeof Message>, ModelQueryBuilderContract<typeof Message>]) {
		query.preload('user')
		countQuery.preload('user')
		query.preload('offer')
		countQuery.preload('offer')
	}
}
