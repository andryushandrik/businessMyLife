// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import FriendService from 'App/Services/User/FriendService'
import ExceptionService from 'App/Services/ExceptionService'
import FriendValidator from 'App/Validators/User/FriendValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class FriendsController {
	public async paginateFriends({ request, response, params }: HttpContextContract) {
		const id: User['id'] = params.id
		let payload: ApiValidator['schema']['props']

		try {
			payload = await request.validate(ApiValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const friends: ModelPaginatorContract<User> = await FriendService.paginate(id, payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, friends))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async paginateIncomings({ request, response, params }: HttpContextContract) {
		const currentUserId: User['id'] = params.currentUserId
		let payload: ApiValidator['schema']['props']

		try {
			payload = await request.validate(ApiValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const incomings: ModelPaginatorContract<User> = await FriendService.paginateRequests(currentUserId, payload, 'incomings')

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, incomings))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async paginateOutgoings({ request, response, params }: HttpContextContract) {
		const currentUserId: User['id'] = params.currentUserId
		let payload: ApiValidator['schema']['props']

		try {
			payload = await request.validate(ApiValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			const outgoings: ModelPaginatorContract<User> = await FriendService.paginateRequests(currentUserId, payload, 'outgoings')

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, outgoings))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async create({ request, response }: HttpContextContract) {
		let payload: FriendValidator['schema']['props']

		try {
			payload = await request.validate(FriendValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			await FriendService.create(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async delete({ request, response }: HttpContextContract) {
		let payload: FriendValidator['schema']['props']

		try {
			payload = await request.validate(FriendValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}

		try {
			await FriendService.delete(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
