// * Types
import type User from 'App/Models/User/User'
import type Offer from 'App/Models/Offer/Offer'
import type { Err } from 'Contracts/response'
import type { JSONPaginate } from 'Contracts/database'
import type { ServiceConfig } from 'Contracts/services'
import type { ConversationGetPayload, ConversationGetWithoutTopicPayload } from 'Contracts/conversation'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import ApiValidator from 'App/Validators/ApiValidator'
import Conversation from 'App/Models/Chat/Conversation'
import { DateTime } from 'luxon'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type GetConfig = ServiceConfig<Conversation> & {
	currentUser?: User['id'] | null // For load new messages
}

export default class ConversationService {
	public static async paginate(userId: User['id'], config: ApiValidator['schema']['props']): Promise<JSONPaginate> {
		try {
			const conversations: JSONPaginate = (
				await Conversation.query()
					.withScopes((scopes) => scopes.getUserConversations(userId))
					.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(userId))
					.getViaPaginate(config)
			).toJSON()

			conversations.data = await Promise.all(conversations.data.map(async (item: Conversation) => item.getForUser(userId)))

			return conversations
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(conversationId: Conversation['id'], { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
		let item: Conversation | null

		try {
			let query = Conversation.query()

			if (trx) query = query.useTransaction(trx)

			if (currentUser) query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

			item = await query.withScopes((scopes) => scopes.getById(conversationId)).first()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async getWithOfferTopic(
		offerId: Offer['id'],
		payload: ConversationGetWithoutTopicPayload,
		{ trx, currentUser }: GetConfig = {},
	): Promise<Conversation> {
		let item: Conversation | null

		try {
			let query = Conversation.query()

			if (trx) query = query.useTransaction(trx)

			if (currentUser) query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

			item = await query.withScopes((scopes) => scopes.getWithOfferTopic(payload.fromId, payload.toId, offerId)).first()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async getWithoutTopic(payload: ConversationGetWithoutTopicPayload, { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
		let item: Conversation | null

		try {
			let query = Conversation.query()

			if (trx) query = query.useTransaction(trx)

			if (currentUser) query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

			item = await query.withScopes((scopes) => scopes.getWithoutTopic(payload.fromId, payload.toId)).first()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async getConversationsWithNewMessages(userId: User['id']): Promise<number> {
		try {
			const result: { total: number }[] = await Conversation.query()
				.withScopes((scopes) => scopes.getUserConversations(userId))
				.whereHas('messages', (query) => {
					query.withScopes((scopes) => scopes.getNew()).withScopes((scopes) => scopes.notCurrentUser(userId))
				})
				.pojo<{ total: number }>()
				.count('*', 'total')

			return result[0].total
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async create(payload: ConversationGetPayload, { trx }: ServiceConfig<Conversation> = {}): Promise<Conversation> {
		let conversationId: Conversation['id']
		let checkAlreadyExistsConversation: Conversation | null = null

		try {
			checkAlreadyExistsConversation = await this.getWithoutTopic(payload)
		} catch (err: Err | any) {}

		if (checkAlreadyExistsConversation) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		try {
			conversationId = (await Conversation.create(payload)).id
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		try {
			return await this.get(conversationId, { trx })
		} catch (err: Err | any) {
			throw err
		}
	}

	public static async updateWhenMessageCreatedOrDeleted(conversation: Conversation, config?: ServiceConfig<Conversation>): Promise<void>
	public static async updateWhenMessageCreatedOrDeleted(conversationId: Conversation['id'], config?: ServiceConfig<Conversation>): Promise<void>
	public static async updateWhenMessageCreatedOrDeleted(
		conversationIdOrItem: Conversation | Conversation['id'],
		{ trx }: ServiceConfig<Conversation> = {},
	): Promise<void> {
		if (typeof conversationIdOrItem !== 'object') {
			try {
				conversationIdOrItem = await this.get(conversationIdOrItem, { trx })
			} catch (err: Err | any) {
				throw err
			}
		}

		try {
			const timestamp: DateTime = DateTime.now()

			await conversationIdOrItem.merge({ updatedAt: timestamp }).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async delete(conversationId: Conversation['id']): Promise<void> {
		let item: Conversation

		try {
			item = await this.get(conversationId)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.delete()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
