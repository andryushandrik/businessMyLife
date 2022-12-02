// * Types
import type User from 'App/Models/User/User'
import type ApiValidator from 'App/Validators/ApiValidator'
import type Conversation from 'App/Models/Chat/Conversation'
import type MessageWithoutTopicValidator from 'App/Validators/Message/MessageWithoutTopicValidator'
import type MessageWithOfferTopicValidator from 'App/Validators/Message/MessageWithOfferTopicValidator'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { ConversationGetPayload } from 'Contracts/conversation'
import type { MessageCreateWithoutTopicPayload, ReturnMessageCreatePayload } from 'Contracts/message'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import Message from 'App/Models/Chat/Message'
import Database from '@ioc:Adonis/Lucid/Database'
import ConversationService from './ConversationService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class MessageService {
  public static async paginate(conversationId: Conversation['id'], config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Message>> {
    let conversation: Conversation

    try {
      conversation = await ConversationService.get(conversationId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await conversation
        .related('messages')
        .query()
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(userId: User['id'], payload: MessageWithoutTopicValidator['schema']['props']): Promise<ReturnMessageCreatePayload> {
    let conversation: Conversation
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.get(payload.conversationId, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }

    try {
      const message: Message = await Message.create({
        userId,
        text: payload.text,
        conversationId: conversation.id,
      }, { client: trx })

      await trx.commit()
      return { message, conversation }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async createWithoutTopic({ text }: MessageWithoutTopicValidator['schema']['props'], payload: MessageCreateWithoutTopicPayload): Promise<ReturnMessageCreatePayload> {
    let conversation: Conversation | null = null
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.getWithoutTopic(payload, { trx })
    } catch (err: Err | any) {}

    console.log('first', conversation?.id)

    if (!conversation) {
      try {
        conversation = await ConversationService.create(payload, { trx })
      } catch (err: Err | any) {
        await trx.rollback()

        throw err
      }
    }

    console.log('second', conversation?.id)


    try {
      conversation = await ConversationService.get(conversation.id, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }

    console.log('third', conversation?.id)


    try {
      const message: Message = await Message.create({
        text,
        userId: payload.fromId,
        conversationId: conversation.id,
      }, { client: trx })

      await trx.commit()
      return { message, conversation }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async createWithOfferTopic(payload: MessageWithOfferTopicValidator['schema']['props'], createPayload: MessageCreateWithoutTopicPayload): Promise<ReturnMessageCreatePayload> {
    let conversation: Conversation | null = null
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.getWithOfferTopic(payload.offerId, createPayload, { trx })
    } catch (err: Err | any) {}

    if (!conversation) {
      try {
        const createConversationPayload: ConversationGetPayload = {
          ...createPayload,
          offerId: payload.offerId,
        }

        conversation = await ConversationService.create(createConversationPayload, { trx })
      } catch (err: Err | any) {
        await trx.rollback()

        throw err
      }
    }

    try {
      conversation = await ConversationService.get(conversation.id, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }

    try {
      const message: Message = await Message.create({
        text: payload.text,
        userId: createPayload.fromId,
        conversationId: conversation.id,
      }, { client: trx })

      await trx.commit()
      return { message, conversation }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async viewed(conversation: Conversation, userId: User['id']): Promise<void>
  public static async viewed(conversationId: Conversation['id'], userId: User['id']): Promise<void>
  public static async viewed(conversationOrConversationId: Conversation | Conversation['id'], userId: User['id']): Promise<void> {
    if (typeof conversationOrConversationId !== 'object') {
      try {
        conversationOrConversationId = await ConversationService.get(conversationOrConversationId)
      } catch (err: Err | any) {
        throw err
      }
    }

    try {
      await conversationOrConversationId
        .related('messages')
        .query()
        .withScopes((scopes) => scopes.getNew())
        .withScopes((scopes) => scopes.notCurrentUser(userId))
        .update({ isViewed: true })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
