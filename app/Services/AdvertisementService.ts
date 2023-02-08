// * Types
import type { Err } from 'Contracts/response'
import type { ServiceConfig } from 'Contracts/services'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class AdvertisementService {
	public static async getAll<M extends LucidModel>(
		model: M,
		config: ServiceConfig<InstanceType<M>> = {},
		query?: ModelQueryBuilderContract<M>,
	): Promise<InstanceType<M>[]> {
		if (!query) query = model.query()

		if (config.relations) {
			for (const item of config.relations) {
				query.preload(item)
			}
		}
		try {
			return await query
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
