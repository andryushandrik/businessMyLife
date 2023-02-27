import Logger from '@ioc:Adonis/Core/Logger'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdvertisementType from 'App/Models/Ads/AdvertisementType'
import ExceptionService from 'App/Services/ExceptionService'
import ResponseService from 'App/Services/ResponseService'
import { ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'

export default class AdvertisementTypesController {
	public async show({ response }: HttpContextContract) {
		try {
			const adsTypes: AdvertisementType[] = await AdvertisementType.query()
			return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, adsTypes))
		} catch (err: Err | any) {
			Logger.error(err)
			throw new ExceptionService(err)
		}
	}
}
