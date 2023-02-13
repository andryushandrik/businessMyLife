import Conversation from 'App/Models/Chat/Conversation'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User/User'
import ConversationService from 'App/Services/Chat/ConversationService'
import ResponseService from 'App/Services/ResponseService'
import { ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'
import ExceptionService from 'App/Services/ExceptionService'

export default class ConversationController {
	public async hasConversationWithUser({ response, request }: HttpContextContract) {
		const targetUserId: User['id'] = request.qs().userId
		try {
			const item: Conversation | null = await ConversationService.getByUserId(targetUserId, { currentUser: request.currentUserId })
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
