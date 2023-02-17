// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import type { ReturnMessageCreatePayload } from 'Contracts/message'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import MessageService from 'App/Services/Chat/MessageService'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import ConversationFindPayloadValidator from 'App/Validators/Chat/ConversationFindPayloadValidator'
import ConversationService from 'App/Services/Chat/ConversationService'
import MessageCreatePayloadValidator from 'App/Validators/Chat/MessageCreatePayloadValidator'

const apiValidator: ApiValidator = new ApiValidator()
const messageCreatePayloadValidator : MessageCreatePayloadValidator = new MessageCreatePayloadValidator()
const conversationFindPayloadValidator: ConversationFindPayloadValidator = new ConversationFindPayloadValidator()
export default class MessagesController {
	public static async paginate(
		conversationFindPayload: any,
		paginateOptions: any,
		currentUserId: User['id'],
		cb: (response: Err | ResponseService) => void,
	): Promise<void> {
		let validatedApiPayload: ApiValidator['schema']['props']
		let validatedConversationFindPayload: ConversationFindPayloadValidator['schema']['props']

		try {
			validatedApiPayload = await validator.validate({
				data: paginateOptions,
				schema: apiValidator.schema,
				messages: apiValidator.messages,
			})

			validatedConversationFindPayload = await validator.validate({
				data: conversationFindPayload,
				schema: conversationFindPayloadValidator.schema,
				messages: conversationFindPayloadValidator.messages,
			})
		} catch (err: any) {
			return cb({
				code: ResponseCodes.CLIENT_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}
		if (validatedConversationFindPayload.conversationId) {
			const isConvAllowed = await ConversationService.isConversationAllowedForUser(currentUserId, validatedConversationFindPayload.conversationId)
			if (!isConvAllowed) {
				return cb({
					code: ResponseCodes.CLIENT_ERROR,
					message: ResponseMessages.FORBIDDEN,
				})
			}
		}

		try {
			const messages: {
				meta: any
				data: ModelObject[]
			} = await MessageService.paginate(validatedConversationFindPayload, validatedApiPayload, currentUserId)

			return cb(new ResponseService(ResponseMessages.SUCCESS, messages))
		} catch (err: Err | any) {
			return cb(err)
		}
	}

	public static async create(userId: User['id'], payload: any, cb: (response: Err | ResponseService) => void): Promise<ReturnMessageCreatePayload | void> {
		let validatedPayload: MessageCreatePayloadValidator['schema']['props']

		try {
			validatedPayload = await validator.validate({
				data: payload,
				schema: messageCreatePayloadValidator.schema,
				messages: messageCreatePayloadValidator.messages,
			})
		} catch (err: any) {
			return cb({
				code: ResponseCodes.CLIENT_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			const data: ReturnMessageCreatePayload = await MessageService.create(userId, validatedPayload)

			cb(new ResponseService(ResponseMessages.SUCCESS, data.message))
			return data
		} catch (err: Err | any) {
			return cb(err)
		}
	}
}
