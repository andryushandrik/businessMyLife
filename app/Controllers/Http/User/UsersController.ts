import Database from '@ioc:Adonis/Lucid/Database'
// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import UserService from 'App/Services/User/UserService'
import BlockUntilValidator from 'App/Validators/BlockUntilValidator'
import UserFilterValidator from 'App/Validators/User/UserFilterValidator'
import { ResponseMessages } from 'Config/response'
import { RoleNames, ROLE_NAMES, USER_TYPE_NAMES } from 'Config/user'

export default class UsersController {
	public async paginate({ view, session, request, route, response }: HttpContextContract) {
		let payload: UserFilterValidator['schema']['props'] | undefined = undefined
		const titleFromController = 'Все пользователи'
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<User> = {
			baseUrl: route!.pattern,
			queryString: request.qs(),
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
			const cities = await Database.rawQuery('select distinct city from users')
			return view.render('pages/user/paginate', {
				users,
				payload,
				titleFromController,
				roles: ROLE_NAMES,
				roleEnum: RoleNames,
				cities: cities.rows,
				usersTypes: USER_TYPE_NAMES,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async paginateAdminAndModerators({ view, session, request, route, response }: HttpContextContract) {
		let payload: UserFilterValidator['schema']['props'] | undefined = undefined
		const titleFromController = 'Администраторы и модераторы'
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<User> = {
			baseUrl: route!.pattern,
			queryString: request.qs(),
			page: request.input('page', 1),
		}

		if (isFiltered) {
			payload = await request.validate(UserFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const users: ModelPaginatorContract<User> = await UserService.paginateAdminsAndModerators(config, payload)

			return view.render('pages/user/paginate', {
				users,
				payload,
				titleFromController,
				roleEnum: RoleNames,
				roles: ROLE_NAMES,
				usersTypes: USER_TYPE_NAMES,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async get({ view, session, params, response }: HttpContextContract) {
		const id: User['id'] = params.id

		try {
			const item: User = await UserService.get(id, { relations: ['images'] })

			return view.render('pages/user/get', { item, RoleNames })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async delete({ response, params, session }: HttpContextContract) {
		const id: User['id'] = params.id

		try {
			await UserService.delete(id)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	public async blockUntil({ request, response, params, session }: HttpContextContract) {
		const id: User['id'] = params.id
		const payload = await request.validate(BlockUntilValidator)

		try {
			await UserService.blockUntil(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}

	public async unblock({ response, params, session }: HttpContextContract) {
		const id: User['id'] = params.id

		try {
			await UserService.unblock(id)

			session.flash('success', ResponseMessages.SUCCESS)
		} catch (err: Err | any) {
			session.flash('error', err.message)
		}

		return response.redirect().back()
	}
}
