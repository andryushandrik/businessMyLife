// * Types
import type User from 'App/Models/User/User'
import type Role from 'App/Models/User/Role'
import type { Err } from 'Contracts/response'
// * Types

import UserService from './UserService'
import Logger from '@ioc:Adonis/Core/Logger'
import { RoleNames } from 'Config/user'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class RoleService {
	public static async changeRole(userId: User['id'], to: RoleNames): Promise<void> {
		let item: User
		const roleId: Role['id'] = to + 1

		try {
			item = await UserService.get(userId)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.merge({ roleId }).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
