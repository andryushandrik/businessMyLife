// * Types
import type { Err } from 'Contracts/response'
import type { UserTokenPayload } from 'Contracts/token'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import authConfig from 'Config/auth'
import TokenService from 'App/Services/TokenService'
import ExceptionService from 'App/Services/ExceptionService'
import { getToken } from 'Helpers/index'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CheckAccessToken {
	public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
		const headerToken: string | undefined = request.header('Authorization')

		if (!headerToken) {
			throw new ExceptionService({
				code: ResponseCodes.CLIENT_ERROR,
				message: ResponseMessages.MISS_AUTH_HEADERS,
			})
		}

		try {
			const token: string = getToken(headerToken)

			try {
				const userTokenPayload = TokenService.verifyToken<UserTokenPayload>(token, authConfig.access.key)
				request.currentUserId = userTokenPayload.id
			} catch (err: Err | any) {
				throw { code: ResponseCodes.TOKEN_EXPIRED, message: ResponseMessages.TOKEN_ERROR }
			}

			await next()
		} catch (err: Err | any) {
			console.log(err)
			throw new ExceptionService(err)
		}
	}
}
