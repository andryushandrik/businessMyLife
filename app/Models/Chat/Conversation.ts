// * Types
import type User from '../User/User'
import type { DateTime } from 'luxon'
import type { BelongsTo, HasMany, HasOne, ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Message from './Message'
import Offer from '../Offer/Offer'
import UserService from 'App/Services/User/UserService'
import {
  BaseModel, beforeFetch, beforeFind,
  belongsTo, column, hasMany,
  hasOne, scope
} from '@ioc:Adonis/Lucid/Orm'

export default class Conversation extends BaseModel {
  public static readonly columns = [
    'id',
    'fromId', 'toId', 'offerId',
    'createdAt', 'updatedAt',
  ] as const

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

  @column({ columnName: 'offer_id' })
  public offerId?: Offer['id']

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
    query
      .where('from_id', userId)
      .orWhere('to_id', userId)
  })

  public static getWithoutTopic = scope((query, fromId: User['id'], toId: User['id']) => {
    query
      .whereNull('offer_id')
      .andWhereIn(['from_id', 'to_id'], [[ fromId, toId ]])
      .orWhereIn(['to_id', 'from_id'], [[ toId, fromId ]])
  })

  public static getWithOfferTopic = scope((query, fromId: User['id'], toId: User['id'], offerId: Offer['id']) => {
    query
      .where('offer_id', offerId)
      .andWhereIn(['from_id', 'to_id'], [[ fromId, toId ]])
      .orWhereIn(['to_id', 'from_id'], [[ toId, fromId ]])
  })

  public static countNewMessagesForCurrentUser = scope((query: ModelQueryBuilderContract<typeof Conversation>, userId: User['id']) => {
    query.withCount('messages', (query) => {
      query
        .withScopes((scopes) => scopes.getNew())
        .withScopes((scopes) => scopes.notCurrentUser(userId))
        .as('newMessagesCount')
    })
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static preloadAndAggregateModels(query: ModelQueryBuilderContract<typeof Conversation>) {
    query
      .preload('offer')
      .preload('lastMessage')
  }

  /**
   * * Other methods
   */

  public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
    const those: Conversation = this // For types
    const item: ModelObject = { ...those.toJSON() }
    const actualUserId: User['id'] = those.fromId == currentUserId ? those.toId : those.fromId

    item.user = await UserService.get(Number(actualUserId))

    return item
  }
}
