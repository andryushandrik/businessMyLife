// * Types
import type User from 'App/Models/User/User'
import type Message from 'App/Models/Chat/Message'
import type Conversation from 'App/Models/Chat/Conversation'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type {
	MessageCreateWithoutTopicPayload,
	ReturnMessageCreatePayload,
} from 'Contracts/message'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import MessageService from 'App/Services/Chat/MessageService'
import MessageWithoutTopicValidator from 'App/Validators/Message/MessageWithoutTopicValidator'
import MessageWithOfferTopicValidator from 'App/Validators/Message/MessageWithOfferTopicValidator'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

const apiValidator: ApiValidator = new ApiValidator()
const messageWithoutTopicValidator: MessageWithoutTopicValidator =
	new MessageWithoutTopicValidator()
const messageWithRealEstateTopicValidator: MessageWithOfferTopicValidator =
	new MessageWithOfferTopicValidator()

export default class MessagesController {
	public static async paginate(
		conversationId: Conversation['id'],
		apiPayload: any,
		cb: (response: Err | ResponseService) => void,
	): Promise<void> {
		let validatedApiPayload: ApiValidator['schema']['props']

		try {
			validatedApiPayload = await validator.validate({
				data: apiPayload,
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
			const messages: ModelPaginatorContract<Message> = await MessageService.paginate(
				conversationId,
				validatedApiPayload,
			)

			return cb(new ResponseService(ResponseMessages.SUCCESS, messages))
		} catch (err: Err | any) {
			return cb(err)
		}
	}

	public static async create(
		userId: User['id'],
		payload: any,
		cb: (response: Err | ResponseService) => void,
	): Promise<ReturnMessageCreatePayload | void> {
		let validatedPayload: MessageWithoutTopicValidator['schema']['props']

		try {
			validatedPayload = await validator.validate({
				data: payload,
				schema: messageWithoutTopicValidator.schema,
				messages: messageWithoutTopicValidator.messages,
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

	public static async createWithoutTopic(
		payload: any,
		createPayload: MessageCreateWithoutTopicPayload,
		cb: (response: Err | ResponseService) => void,
	): Promise<ReturnMessageCreatePayload | void> {
		let validatedPayload: MessageWithoutTopicValidator['schema']['props']

		try {
			validatedPayload = await validator.validate({
				data: payload,
				schema: messageWithoutTopicValidator.schema,
				messages: messageWithoutTopicValidator.messages,
			})
		} catch (err: any) {
			return cb({
				code: ResponseCodes.CLIENT_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			const data: ReturnMessageCreatePayload = await MessageService.createWithoutTopic(
				validatedPayload,
				createPayload,
			)

			cb(new ResponseService(ResponseMessages.SUCCESS, data.message))
			return data
		} catch (err: Err | any) {
			return cb(err)
		}
	}

	public static async createWithOfferTopic(
		payload: any,
		createPayload: MessageCreateWithoutTopicPayload,
		cb: (response: Err | ResponseService) => void,
	): Promise<ReturnMessageCreatePayload | void> {
		let validatedPayload: MessageWithOfferTopicValidator['schema']['props']

		try {
			validatedPayload = await validator.validate({
				data: payload,
				schema: messageWithRealEstateTopicValidator.schema,
				messages: messageWithRealEstateTopicValidator.messages,
			})
		} catch (err: any) {
			return cb({
				code: ResponseCodes.CLIENT_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			const data: ReturnMessageCreatePayload = await MessageService.createWithOfferTopic(
				validatedPayload,
				createPayload,
			)

			cb(new ResponseService(ResponseMessages.SUCCESS, data.message))
			return data
		} catch (err: Err | any) {
			return cb(err)
		}
	}
}
