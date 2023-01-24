// * Types
import type FriendValidator from 'App/Validators/User/FriendValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import User from 'App/Models/User/User'
import UserService from './UserService'
import Friend from 'App/Models/User/Friend'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class FriendService {
	public static async paginate(
		id: User['id'],
		config: PaginateConfig<User>,
	): Promise<ModelPaginatorContract<User>> {
		const friendsIds: User['id'][] = []

		try {
			const query1: Array<{ to_id: Friend['toId'] }> = await Friend.query()
				.select('to_id')
				.where('from_id', id)
				.withScopes((scopes) => scopes.getByRequest(false))
				.pojo()

			friendsIds.push(...query1.map((item) => item.to_id))

			const query2: Array<{ from_id: Friend['fromId'] }> = await Friend.query()
				.select('from_id')
				.where('to_id', id)
				.withScopes((scopes) => scopes.getByRequest(false))
				.pojo()

			friendsIds.push(...query2.map((item) => item.from_id))
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		try {
			return await User.query().whereIn('id', friendsIds).getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async paginateRequests(
		id: User['id'],
		config: PaginateConfig<User>,
		action: 'incomings' | 'outgoings',
	): Promise<ModelPaginatorContract<User>> {
		let user: User

		try {
			user = await UserService.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			return await user.related(action).query().getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async create(payload: FriendValidator['schema']['props']): Promise<void> {
		let alreadyExistsRequest: Friend | undefined = undefined
		const friendPayload: Partial<ModelAttributes<Friend>> = {
			isRequest: true,
			fromId: payload.fromId,
			toId: payload.toId,
		}

		try {
			alreadyExistsRequest = await this.getByFromIdAndToId(payload.toId, payload.fromId)
		} catch (err: Err | any) {}

		if (alreadyExistsRequest) {
			try {
				await this.update(payload.toId, payload.fromId, false)
			} catch (err: Err | any) {
				throw err
			}
		} else {
			try {
				await Friend.create(friendPayload)
			} catch (err: any) {
				Logger.error(err)
				throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}
	}

	public static async delete(payload: FriendValidator['schema']['props']): Promise<void> {
		let item: Friend

		try {
			item = await this.getByFromIdAndToId(payload.fromId, payload.toId)
		} catch (err: Err | any) {
			try {
				item = await this.getByFromIdAndToId(payload.toId, payload.fromId)
			} catch (err: Err | any) {
				throw err
			}
		}

		try {
			await item.delete()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	/**
	 * * Private methods
	 */

	private static async getByFromIdAndToId(fromId: User['id'], toId: User['id']): Promise<Friend> {
		let item: Friend | null

		try {
			item = await Friend.query()
				.withScopes((scopes) => scopes.getByFromIdAndToId(fromId, toId))
				.first()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	private static async update(
		fromId: User['id'],
		toId: User['id'],
		isRequest: Friend['isRequest'],
	): Promise<void> {
		let item: Friend

		try {
			item = await this.getByFromIdAndToId(fromId, toId)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.merge({ isRequest }).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
