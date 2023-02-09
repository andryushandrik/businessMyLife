// * Types
import type UserValidator from 'App/Validators/User/UserValidator'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import type BlockUntilValidator from 'App/Validators/BlockUntilValidator'
import type UpdatePasswordValidator from 'App/Validators/User/UpdatePassword'
import type UserFilterValidator from 'App/Validators/User/UserFilterValidator'
import type RegisterValidator from 'App/Validators/Auth/Register/RegisterValidator'
import type EmailVerifyValidator from 'App/Validators/User/UpdateEmail/EmailVerifyValidator'
import type UpdateEmailValidator from 'App/Validators/User/UpdateEmail/UpdateEmailValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import authConfig from 'Config/auth'
import User from 'App/Models/User/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Drive from '@ioc:Adonis/Core/Drive'
import RedisService from '../RedisService'
import Logger from '@ioc:Adonis/Core/Logger'
import MailerService from '../MailerService'
import { RoleNames } from 'Config/user'
import { RedisKeys } from 'Config/redis'
import { getRandom } from 'Helpers/index'
import { USER_FOLDER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class UserService {
	public static async paginate(config: PaginateConfig<User>, filter?: UserFilterValidator['schema']['props']): Promise<ModelPaginatorContract<User>> {
		let query: ModelQueryBuilderContract<typeof User> = User.query()

		if (config.aggregates) {
			for (const item of config.aggregates) {
				await query.withCount(item)
			}
		}

		if (filter) query = this.filter(query, filter)

		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async paginateAdminsAndModerators(
		config: PaginateConfig<User>,
		filter?: UserFilterValidator['schema']['props'],
	): Promise<ModelPaginatorContract<User>> {
		const roleTypes: RoleNames[] = [RoleNames.ADMIN, RoleNames.MODERATOR]
		let query: ModelQueryBuilderContract<typeof User> = User.query().withScopes((scopes) => scopes.getByRoleIds(roleTypes))

		if (filter) query = this.filter(query, filter)

		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: User['id'], config?: ServiceConfig<User>): Promise<User>
	public static async get(email: User['email'], config?: ServiceConfig<User>): Promise<User>
	public static async get(idOrEmail: User['id'] | User['email'], { relations, aggregates }: ServiceConfig<User> = {}): Promise<User> {
		let item: User | null

		try {
			if (typeof idOrEmail === 'number') item = await User.find(idOrEmail)
			else item = await User.findBy('email', idOrEmail)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		try {
			if (relations) {
				for (const relation of relations) {
					await item.load(relation)
				}
			}

			if (aggregates) {
				for (const relation of aggregates) {
					await item.loadCount(relation)
				}
			}

			return item
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async getUsersIdsByQuery(query: string): Promise<User['id'][]> {
		try {
			const users: { id: User['id'] }[] = await User.query()
				.select('id')
				.withScopes((scopes) => scopes.search(query))

			return users.map((item) => item.id)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async create(payload: Omit<RegisterValidator['schema']['props'], 'verifyCode'>): Promise<User> {
		let item: User
		const roleId: User['roleId'] = RoleNames.USER + 1

		try {
			item = await User.create({ ...payload, roleId })
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		try {
			return await this.get(item.id)
		} catch (err: Err | any) {
			throw err
		}
	}

	public static async update(id: User['id'], payload: UserValidator['schema']['props']): Promise<User> {
		let item: User
		let avatar: User['avatar'] | undefined = undefined

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		if (payload.avatar) {
			if (item.avatar) await Drive.delete(item.avatar)

			try {
				avatar = await this.uploadImage(item.id, payload.avatar)
			} catch (err: any) {
				throw new Error('Произошла ошибка во время загрузки файла')
			}
		}

		try {
			await item.merge({ ...payload, avatar }).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		try {
			return await this.get(item.id)
		} catch (err: Err | any) {
			throw err
		}
	}

	public static async updateEmail(id: User['id'], payload: UpdateEmailValidator['schema']['props']): Promise<void> {
		let item: User

		try {
			await this.codeVerify(payload)

			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.merge({ email: payload.newEmail }).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async updatePassword(id: User['id'], payload: UpdatePasswordValidator['schema']['props']): Promise<void> {
		let item: User

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		if (!(await Hash.verify(item.password, payload.oldPassword))) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		try {
			await item.merge({ password: payload.password }).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR } as Err
		}
	}

	public static async delete(id: User['id']): Promise<void> {
		let item: User

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.delete()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async blockUntil(id: User['id'], payload: BlockUntilValidator['schema']['props']): Promise<void> {
		let item: User

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.merge(payload).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async unblock(id: User['id']): Promise<void> {
		let item: User

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}
		const payload = {
			blockedUntil: null,
			blockDescription: null,
		}
		try {
			await item.merge(payload).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async emailVerify({ email }: EmailVerifyValidator['schema']['props']): Promise<void> {
		const code: number = getRandom(100000, 999999) // Only 6-digit code
		const redisKey: RedisKeys = RedisKeys.UPDATE_EMAIL_VERIFY

		try {
			await RedisService.set(redisKey, email, code, {
				expiration: authConfig.userVerifyExpire,
				safety: true,
			})

			await MailerService.sendUpdateEmailCode(email, code)
		} catch (err: Err | any) {
			throw err
		}
	}

	public static async codeVerify(payload: UpdateEmailValidator['schema']['props']): Promise<void> {
		const redisKey: RedisKeys = RedisKeys.UPDATE_EMAIL_VERIFY

		try {
			const candidateCode: string = await RedisService.get(redisKey, payload.email)

			if (Number(candidateCode) != payload.verifyCode)
				throw {
					code: ResponseCodes.CLIENT_ERROR,
					message: ResponseMessages.CODE_VERIFICATION_NOT_FOUND,
				} as Err
		} catch (err: Err | any) {
			throw err
		}
	}

	/**
	 * * Private methods
	 */

	private static async uploadImage(id: User['id'], image: MultipartFileContract): Promise<string> {
		const fileName = `${id}_${image.clientName}`

		try {
			await image.moveToDisk(USER_FOLDER_PATH, { name: fileName })
			return `${USER_FOLDER_PATH}/${fileName}`
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	private static filter(
		query: ModelQueryBuilderContract<typeof User>,
		payload: UserFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof User> {
		for (const key in payload) {
			if (payload[key]) {
				switch (key) {
					// Skip this api's keys
					case 'page':
					case 'limit':
					case 'orderBy':
					case 'orderByColumn':
						break
					// Skip this api's keys

					case 'query':
						query = query.withScopes((scopes) => scopes.search(payload[key]!))

						break

					default:
						break
				}
			}
		}

		return query
	}
}
