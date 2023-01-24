// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { AuthHeaders } from 'Contracts/auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AuthService from 'App/Services/AuthService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import ApiLoginValidator from 'App/Validators/Auth/ApiLoginValidator'
import RegisterValidator from 'App/Validators/Auth/Register/RegisterValidator'
import CodeVerifyValidator from 'App/Validators/Auth/Register/CodeVerifyValidator'
import EmailVerifyValidator from 'App/Validators/Auth/Register/EmailVerifyValidator'
import ForgotPasswordValidator from 'App/Validators/Auth/ForgotPassword/ForgotPasswordValidator'
import ForgotPasswordEmailVerifyValidator from 'App/Validators/Auth/ForgotPassword/ForgotPasswordEmailVerifyValidator'
import ForgotPasswordCodePasswordVerifyValidator from 'App/Validators/Auth/ForgotPassword/ForgotPasswordCodeVerifyValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { COOKIE_REFRESH_TOKEN_CONFIG, COOKIE_REFRESH_TOKEN_KEY } from 'Config/auth'

export default class AuthController {
	public async login({ request, response }: HttpContextContract) {
		let payload: ApiLoginValidator['schema']['props']
		const headers: AuthHeaders = {
			fingerprint: request.header('User-Fingerprint')!,
			userAgent: request.header('User-Agent')!,
			ip: request.ip(),
		}

		try {
			payload = await request.validate(ApiLoginValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			const data = await AuthService.loginViaAPI(payload, headers)

			response.cookie(COOKIE_REFRESH_TOKEN_KEY, data.tokens.refresh, COOKIE_REFRESH_TOKEN_CONFIG)

			return response.status(200).send(
				new ResponseService(ResponseMessages.SUCCESS, {
					user: data.user,
					token: data.tokens.access,
				}),
			)
		} catch (err: Err | any) {
			response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

			throw new ExceptionService(err)
		}
	}

	public async logout({ request, response }: HttpContextContract) {
		const token: string = request.cookie(COOKIE_REFRESH_TOKEN_KEY)
		const headers: AuthHeaders = {
			fingerprint: request.header('User-Fingerprint')!,
			userAgent: request.header('User-Agent')!,
			ip: request.ip(),
		}

		try {
			await AuthService.logoutViaAPI(token, headers)

			response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

			throw new ExceptionService(err)
		}
	}

	public async refreshToken({ request, response }: HttpContextContract) {
		const token: string = request.cookie(COOKIE_REFRESH_TOKEN_KEY)
		const headers: AuthHeaders = {
			fingerprint: request.header('User-Fingerprint')!,
			userAgent: request.header('User-Agent')!,
			ip: request.ip(),
		}

		try {
			const data = await AuthService.refreshToken(token, headers)

			response.cookie(COOKIE_REFRESH_TOKEN_KEY, data.tokens.refresh, COOKIE_REFRESH_TOKEN_CONFIG)

			return response.status(200).send(
				new ResponseService(ResponseMessages.SUCCESS, {
					user: data.user,
					token: data.tokens.access,
				}),
			)
		} catch (err: Err | any) {
			response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

			throw new ExceptionService(err)
		}
	}

	/**
	 * * Register
	 */

	public async register({ request, response }: HttpContextContract) {
		let payload: RegisterValidator['schema']['props']
		const headers: AuthHeaders = {
			fingerprint: request.header('User-Fingerprint')!,
			userAgent: request.header('User-Agent')!,
			ip: request.ip(),
		}

		try {
			payload = await request.validate(RegisterValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			const data = await AuthService.registerViaAPI(payload, headers)

			response.cookie(COOKIE_REFRESH_TOKEN_KEY, data.tokens.refresh, COOKIE_REFRESH_TOKEN_CONFIG)

			return response.status(200).send(
				new ResponseService(ResponseMessages.SUCCESS, {
					user: data.user,
					token: data.tokens.access,
				}),
			)
		} catch (err: Err | any) {
			response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

			throw new ExceptionService(err)
		}
	}

	public async emailVerify({ request, response }: HttpContextContract) {
		let payload: EmailVerifyValidator['schema']['props']

		try {
			payload = await request.validate(EmailVerifyValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			await AuthService.emailVerify(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async codeVerify({ request, response }: HttpContextContract) {
		let payload: CodeVerifyValidator['schema']['props']

		try {
			payload = await request.validate(CodeVerifyValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			await AuthService.codeVerify(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	/**
	 * * Forgot password
	 */

	public async forgotPassword({ request, response }: HttpContextContract) {
		let payload: ForgotPasswordValidator['schema']['props']

		try {
			payload = await request.validate(ForgotPasswordValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			const user: User = await AuthService.forgotPassword(payload)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, user))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async forgotPasswordEmailVerify({ request, response }: HttpContextContract) {
		let payload: ForgotPasswordEmailVerifyValidator['schema']['props']

		try {
			payload = await request.validate(ForgotPasswordEmailVerifyValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			await AuthService.emailVerify(payload, true)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async forgotPasswordCodeVerify({ request, response }: HttpContextContract) {
		let payload: ForgotPasswordCodePasswordVerifyValidator['schema']['props']

		try {
			payload = await request.validate(ForgotPasswordCodePasswordVerifyValidator)
		} catch (err: any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				errors: err.messages,
			})
		}

		try {
			await AuthService.codeVerify(payload, true)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}
}
