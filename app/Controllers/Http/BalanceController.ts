// * Types
import User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import UserService from 'App/Services/User/UserService'
import UserFilterValidator from 'App/Validators/User/UserFilterValidator'
import { RoleNames, ROLE_NAMES, USER_TYPE_NAMES } from 'Config/user'
import BalanceService from 'App/Services/BalanceService'
import ResponseService from 'App/Services/ResponseService'
import { ResponseMessages } from 'Config/response'
import ExceptionService from 'App/Services/ExceptionService'

export default class BalanceController {
	public async index({ view, session, request, route, response }: HttpContextContract) {
		let payload: UserFilterValidator['schema']['props'] | undefined = undefined
		const titleFromController = 'Все пользователи'
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<User> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),

			aggregates: ['reports'],
		}

		if (isFiltered) {
			payload = await request.validate(UserFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const users: ModelPaginatorContract<User> = await UserService.paginate(config, payload)

			return view.render('pages/balance/index', {
				users,
				payload,
				titleFromController,
				roles: ROLE_NAMES,
				roleEnum: RoleNames,
				usersTypes: USER_TYPE_NAMES,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ request, response, params }: HttpContextContract) {
		const userId: User['id'] = params.userId

		const newBalance = +request.body().balance

		try {
			await BalanceService.updateBalanceOfUser(userId, newBalance)

			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
		} catch (err: Err | any) {
			throw new ExceptionService(err)
		}
	}

	public async accrue({ view, params, response, session }: HttpContextContract) {
		const userId: User['id'] = +params.userId
		try {
			const user: User = await UserService.get(userId)
			return view.render('pages/balance/accrue', { user })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}

