// * Types
import type UploadTutorial from 'App/Models/UploadTutorial'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import UploadTutorialService from 'App/Services/UploadTutorialService'
import UploadTutorialValidator from 'App/Validators/UploadTutorial/UploadTutorialValidator'
import UploadTutorialFilterValidator from 'App/Validators/UploadTutorial/UploadTutorialFilterValidator'
import { ResponseMessages } from 'Config/response'

export default class UploadTutorialsController {
	public async index({ request, response, route, view, session }: HttpContextContract) {
		let payload: UploadTutorialFilterValidator['schema']['props'] | undefined = undefined
		const isFiltered: boolean = request.input('isFiltered', false)
		const config: PaginateConfig<UploadTutorial> = {
			baseUrl: route!.pattern,
			page: request.input('page', 1),
		}

		if (isFiltered) {
			payload = await request.validate(UploadTutorialFilterValidator)

			config.orderBy = payload.orderBy
			config.orderByColumn = payload.orderByColumn
		}

		try {
			const tutorials: ModelPaginatorContract<UploadTutorial> =
				await UploadTutorialService.paginate(config, payload)

			return view.render('pages/uploadTutorial/index', {
				payload,
				tutorials,
			})
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		return view.render('pages/uploadTutorial/create')
	}

	public async store({ request, session, response }: HttpContextContract) {
		const payload = await request.validate(UploadTutorialValidator)

		try {
			await UploadTutorialService.create(payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('upload_tutorials.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async show({ view, params, session, response }: HttpContextContract) {
		const id: UploadTutorial['id'] = params.id

		try {
			const item: UploadTutorial = await UploadTutorialService.get(id)

			return view.render('pages/uploadTutorial/show', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, session, response }: HttpContextContract) {
		const id: UploadTutorial['id'] = params.id

		try {
			const item: UploadTutorial = await UploadTutorialService.get(id)

			return view.render('pages/uploadTutorial/edit', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ params, request, session, response }: HttpContextContract) {
		const id: UploadTutorial['id'] = params.id
		const payload = await request.validate(UploadTutorialValidator)

		try {
			await UploadTutorialService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('upload_tutorials.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, session, response }: HttpContextContract) {
		const id: UploadTutorial['id'] = params.id

		try {
			await UploadTutorialService.delete(id)
			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
