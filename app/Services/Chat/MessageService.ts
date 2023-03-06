import Database from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Conversation from 'App/Models/Chat/Conversation'
import Message from 'App/Models/Chat/Message'
import User from 'App/Models/User/User'
import ApiValidator from 'App/Validators/ApiValidator'
import ConversationFindPayloadValidator from 'App/Validators/Chat/ConversationFindPayloadValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { serializedModel } from 'Config/types'
import { ConversationGetPayload } from 'Contracts/conversation'
import { ReturnMessageCreatePayload } from 'Contracts/message'
import ConversationService from './ConversationService'
import { logger as Logger } from 'Config/app'
import { Err } from 'Contracts/response'
import MessageCreatePayloadValidator from 'App/Validators/Chat/MessageCreatePayloadValidator'

export default class MessageService {
	public static async paginate(
		conversationFindPayload: ConversationFindPayloadValidator['schema']['props'],
		config: ApiValidator['schema']['props'],
		currentUserId: User['id'],
	): Promise<serializedModel> {
		let conversation: Conversation
		const receiverId: User['id'] | undefined = conversationFindPayload.userId

		try {
			if (receiverId) {
				conversation = await ConversationService.getByUserIds(receiverId, currentUserId)
			} else if (conversationFindPayload.conversationId) {
				conversation = await ConversationService.getById(conversationFindPayload.conversationId)

				await ConversationService.updateWhenMessageCreatedOrDeleted(conversation)
			} else {
				throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err
			}
		} catch (err: Err | any) {
			throw err
		}

		try {
			const paginatedMessages: ModelPaginatorContract<Message> = await conversation.related('messages').query().preload('offer').getViaPaginate(config)
			const messages: serializedModel = paginatedMessages.serialize({
				relations: {
					offer: {
						fields: {
							pick: ['description', 'title'],
						},
					},
				},
			})

			return messages
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async 	create(currentUserId: User['id'], payload: MessageCreatePayloadValidator['schema']['props']): Promise<ReturnMessageCreatePayload> {
		let conversation: Conversation | undefined
		const trx = await Database.transaction()
		const receiverId: User['id'] | undefined = payload.userId

		if (receiverId) {
			try {
				conversation = await ConversationService.getByUserIds(receiverId, currentUserId, { trx })
			} catch {
				conversation = undefined
			}
		} else if (payload.conversationId) {
			try {
				conversation = await ConversationService.getById(payload.conversationId, { trx })

				await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
			} catch (err: Err | any) {
				await trx.rollback()
				console.log('??')

				throw {
					code: ResponseCodes.NOT_FOUND,
					message: ResponseMessages.CONVERSATION_NOT_FOUND,
				} as Err
			}
		} else {
			throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!conversation) {
			try {
				const conversationCreatePayload: ConversationGetPayload = {
					fromId: currentUserId,
					toId: payload.userId!,
				}
				conversation = await ConversationService.create(conversationCreatePayload, { trx })
			} catch (err: Err | any) {
				await trx.rollback()

				throw err
			}
		}

		try {
			const maxInterval = 1000 * 60 * 60 * 10 // в милисекундах
			console.log(payload.offerId)
			if (payload.offerId) {
				console.log(113)
				const afterTime = Date.now() - maxInterval
				const attachOffer: boolean = await MessageService.CheckLastRelatedOfferAfterTime(conversation.id, payload.offerId, new Date(afterTime))
				console.log(attachOffer)

				if (!attachOffer) {
					payload.offerId = undefined
				}
			}

			const createdMessage: Message = await Message.create(
				{
					userId: currentUserId,
					text: payload.text,
					offerId: payload.offerId,
					conversationId: conversation.id,
				},
				{ client: trx },
			)

			await trx.commit()
			const message: Message = await Message.findOrFail(createdMessage.id)
			return { message, conversation }
		} catch (err: any) {
			await trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async CheckLastRelatedOfferAfterTime(conversationId: number, offerId: number, maxTime: Date) {
		try {
			const messages: Message[] | null = await Message.query()
				.preload('offer')
				.select()
				.limit(1)
				.where('conversation_id', conversationId)
				.where('createdAt', '>', maxTime)
				.whereNotNull('offerId')
				.orderBy('createdAt', 'desc')
			const result = messages[0]?.offerId != offerId
			console.log(messages[0]?.offerId, offerId)

			return result
		} catch (err: Err | any) {
			console.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
	public static async viewed(conversationOrConversationId: Conversation | Conversation['id'], currentUserId: User['id']): Promise<void> {
		if (typeof conversationOrConversationId !== 'object') {
			try {
				conversationOrConversationId = await ConversationService.getById(conversationOrConversationId)
			} catch (err: Err | any) {
				throw err
			}
		}

		try {
			await conversationOrConversationId
				.related('messages')
				.query()
				.withScopes((scopes) => scopes.getNew())
				.withScopes((scopes) => scopes.notCurrentUser(currentUserId))
				.update({ isViewed: true })
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
