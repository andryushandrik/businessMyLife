// * Types
import type PromoCodeValidator from 'App/Validators/PromoCode/PromoCodeValidator'
import type PromoCodeFilterValidator from 'App/Validators/PromoCode/PromoCodeFilterValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import PromoCode from 'App/Models/PromoCode'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class PromoCodeService {
	public static async paginate(
		config: PaginateConfig<PromoCode>,
		filter?: PromoCodeFilterValidator['schema']['props'],
	): Promise<ModelPaginatorContract<PromoCode>> {
		let query: ModelQueryBuilderContract<typeof PromoCode> = PromoCode.query()

		if (filter) query = this.filter(query, filter)

		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: PromoCode['id']): Promise<PromoCode> {
		let item: PromoCode | null

		try {
			item = await PromoCode.find(id)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async create(payload: PromoCodeValidator['schema']['props']): Promise<void> {
		try {
			await PromoCode.create(payload)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async update(id: PromoCode['id'], payload: PromoCodeValidator['schema']['props']): Promise<void> {
		let item: PromoCode

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.merge(payload).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async delete(id: PromoCode['id']): Promise<void> {
		let item: PromoCode

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.delete()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	/**
	 * * Private methods
	 */

	private static filter(
		query: ModelQueryBuilderContract<typeof PromoCode>,
		payload: PromoCodeFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof PromoCode> {
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
