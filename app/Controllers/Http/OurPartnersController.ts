import OurPartnersValidator from 'App/Validators/OurPartnersValidator'
// * Types
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import { ResponseMessages } from 'Config/response'
import OurPartner from 'App/Models/OurPartner'
import OurPartnersService from 'App/Services/OurPartnersService'

export default class OurPartnersController {
	public async index({ view, request, response, session, route }: HttpContextContract) {
		const baseUrl: string = route!.pattern
		const page: number = request.input('page', 1)

		try {
			const ourPartners: ModelPaginatorContract<OurPartner> = await OurPartnersService.paginate({
				page,
				baseUrl,
				queryString: request.qs(),
			})
			return await view.render('pages/ourpartners/index', { ourPartners })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async create({ view }: HttpContextContract) {
		return await view.render('pages/ourpartners/create')
	}

	public async store({ request, response, session }: HttpContextContract) {
		try {
			const payload = await request.validate(OurPartnersValidator)
			payload.isVisible = payload.isVisible ? true : false
			await OurPartnersService.create(payload)
			session.flash('success', ResponseMessages.SUCCESS)
			response.redirect().toRoute('ourpartners.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			console.log(err)
			return response.redirect().back()
		}
	}

	public async edit({ view, params, response, session }: HttpContextContract) {
		const id: OurPartner['id'] = params.id

		try {
			const item: OurPartner = await OurPartnersService.get(id)

			return view.render('pages/ourpartners/edit', { item })
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async update({ request, response, session, params }: HttpContextContract) {
		const id: OurPartner['id'] = params.id
		const payload = await request.validate(OurPartnersValidator)
		payload.isVisible = payload.isVisible ? true : false
		try {
			await OurPartnersService.update(id, payload)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().toRoute('ourpartners.index')
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}

	public async destroy({ params, response, session }: HttpContextContract) {
		const id: OurPartner['id'] = params.id

		try {
			await OurPartnersService.delete(id)

			session.flash('success', ResponseMessages.SUCCESS)
			return response.redirect().back()
		} catch (err: Err | any) {
			session.flash('error', err.message)
			return response.redirect().back()
		}
	}
}
