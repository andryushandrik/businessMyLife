// * Types
import type User from 'App/Models/User/User'
import type Conversation from 'App/Models/Chat/Conversation'
import type { Err } from 'Contracts/response'
import type { SocketData } from 'Contracts/webSocket'
import type { JSONPaginate } from 'Contracts/database'
import type { ModelObject } from '@ioc:Adonis/Lucid/Orm'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import MessageService from 'App/Services/Chat/MessageService'
import ConversationService from 'App/Services/Chat/ConversationService'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

const apiValidator: ApiValidator = new ApiValidator()

export default class ConversationsController {
  public static async paginate(userId: SocketData['userId'], payload: any, cb: (response: Err | ResponseService) => void): Promise<void> {
    let validatedPayload: ApiValidator['schema']['props']

    try {
      validatedPayload = await validator.validate({
        data: payload,
        schema: apiValidator.schema,
        messages: apiValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const conversations: JSONPaginate = await ConversationService.paginate(userId, validatedPayload)

      return cb(new ResponseService(ResponseMessages.SUCCESS, conversations))
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async get(conversationId: Conversation['id'], currentUserId: User['id'], cb: (response: Err | ResponseService) => void): Promise<Conversation | void> {
    try {
      const item: Conversation = await ConversationService.get(conversationId)
      const itemForUser: ModelObject = await item.getForUser(currentUserId)

      await MessageService.viewed(item.id, currentUserId)

      cb(new ResponseService(ResponseMessages.SUCCESS, itemForUser))
      return itemForUser as Conversation
    } catch (err: Err | any) {
      return cb(err)
    }
  }

  public static async delete(conversationId: Conversation['id'], cb: (response: Err | ResponseService) => void): Promise<Conversation | void> {
    try {
      await ConversationService.delete(conversationId)

      cb(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      return cb(err)
    }
  }
}
