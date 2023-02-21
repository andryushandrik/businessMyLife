import Conversation from 'App/Models/Chat/Conversation'
import User from 'App/Models/User/User'
import ApiValidator from 'App/Validators/ApiValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { ConversationGetPayload } from 'Contracts/conversation'
import { JSONPaginate } from 'Contracts/database'
import { ServiceConfig } from 'Contracts/services'
import { DateTime } from 'luxon'
import Logger from '@ioc:Adonis/Core/Logger'
import { Err } from 'Contracts/response'

type GetConfig = ServiceConfig<Conversation> & {
	currentUser?: User['id'] | null // For load new messages
}

export default class ConversationService {
	public static async paginate(userId: User['id'], config: ApiValidator['schema']['props']): Promise<JSONPaginate> {
		try {
			if (!config.orderBy) config.orderBy = 'desc'
			if (!config.orderByColumn) config.orderByColumn = 'updatedAt'

			const conversations: JSONPaginate = (
				await Conversation.query()
					.withScopes((scopes) => scopes.getUserConversations(userId))
					.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(userId))
					.getViaPaginate(config)
			).toJSON()
			// console.log(conversations.data[0].$extras); //dev
			// console.log(conversations); //dev

			conversations.data = await Promise.all(conversations.data.map(async (item: Conversation) => item.getForUser(userId)))
			// console.log(conversations.data); //dev

			return conversations
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async isConversationAllowedForUser(userId: number, conversationId: number): Promise<boolean> {
		const query = Conversation.query()
		const item = await query.withScopes((scopes) => scopes.getById(conversationId)).first()

		if (item?.toId == userId || item?.fromId == userId) {
			return true
		}

		return false
	}

	public static async getById(conversationId: Conversation['id'], { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
		let item: Conversation | null

		try {
			let query = Conversation.query()

			if (trx) query = query.useTransaction(trx)

			if (currentUser) query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

			item = await query.withScopes((scopes) => scopes.getById(conversationId)).first()
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async getByUserIds(receiverId: User['id'], currentUserId: User['id'], { trx }: GetConfig = {}): Promise<Conversation> {
		let item: Conversation | null

		try {
			let query = Conversation.query()

			if (trx) query = query.useTransaction(trx)

			query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUserId))

			item = await query.withScopes((scopes) => scopes.getByUsersIds(receiverId, currentUserId)).first()
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item)
			throw {
				code: ResponseCodes.NOT_FOUND,
				message: ResponseMessages.CONVERSATION_NOT_FOUND,
			} as Err

		return item
	}

	public static async getWithoutTopic(fromId: User['id'], toId: User['id'], { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
		let item //: Conversation | null

		try {
			let query = Conversation.query()

			if (trx) query = query.useTransaction(trx)

			if (currentUser) query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

			item = await query.withScopes((scopes) => scopes.getByUsersIds(fromId, toId)).first()
			console.log('ConversationsController.getWithoutTopic')
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item)
			throw {
				code: ResponseCodes.NOT_FOUND,
				message: ResponseMessages.CONVERSATION_NOT_FOUND,
			} as Err

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
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async create(payload: ConversationGetPayload, { trx }: ServiceConfig<Conversation> = {}): Promise<Conversation> {
		let conversationId: Conversation['id']
		let checkAlreadyExistsConversation: Conversation | null = null

		try {
			checkAlreadyExistsConversation = await this.getWithoutTopic(payload.fromId, payload.toId)
		} catch (Err: Err | any) {}

		if (checkAlreadyExistsConversation) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		try {
			conversationId = (await Conversation.create(payload)).id
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		try {
			return await this.getById(conversationId, { trx })
		} catch (Err: Err | any) {
			throw Err
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
				conversationIdOrItem = await this.getById(conversationIdOrItem, { trx })
			} catch (Err: Err | any) {
				throw Err
			}
		}

		try {
			const timestamp: DateTime = DateTime.now()

			await conversationIdOrItem.merge({ updatedAt: timestamp }).save()
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async delete(conversationId: Conversation['id']): Promise<void> {
		let item: Conversation

		try {
			item = await this.getById(conversationId)
		} catch (Err: Err | any) {
			throw Err
		}

		try {
			await item.delete()
		} catch (Err: any) {
			Logger.error(Err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
