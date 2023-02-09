// * Types
import type Area from 'App/Models/Offer/Area'
import type SubsectionValidator from 'App/Validators/Offer/SubsectionValidator'
import type SubsectionFilterValidator from 'App/Validators/Offer/SubsectionFilterValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import Subsection from 'App/Models/Offer/Subsection'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class SubsectionService {
	public static async paginate(
		config: PaginateConfig<Subsection>,
		filter?: SubsectionFilterValidator['schema']['props'],
	): Promise<ModelPaginatorContract<Subsection>> {
		let query: ModelQueryBuilderContract<typeof Subsection> = Subsection.query()

		if (config.relations) {
			for (const item of config.relations) {
				query = query.preload(item)
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

	public static async get(id: Subsection['id']): Promise<Subsection> {
		let item: Subsection | null

		try {
			item = await Subsection.find(id)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async getAll(areaId?: Area['id']): Promise<Subsection[]> {
		let query: ModelQueryBuilderContract<typeof Subsection> = Subsection.query()

		if (areaId) query = query.withScopes((scopes) => scopes.getByAreaId(areaId))

		try {
			return await query
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async getSubsectionsIdsByAreaId(areaId: Area['id']): Promise<Subsection['id'][]> {
		try {
			const subsections: { id: Subsection['id'] }[] = await Subsection.query()
				.select('id')
				.withScopes((scopes) => scopes.getByAreaId(areaId))
				.pojo()

			return subsections.map((item) => item.id)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async create(payload: SubsectionValidator['schema']['props']): Promise<Subsection> {
		try {
			return await Subsection.create(payload)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async update(id: Subsection['id'], payload: SubsectionValidator['schema']['props']): Promise<Subsection> {
		let item: Subsection

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			return await item.merge(payload).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async delete(id: Subsection['id']): Promise<void> {
		let item: Subsection

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

	/**
	 * * Private methods
	 */

	private static filter(
		query: ModelQueryBuilderContract<typeof Subsection>,
		payload: SubsectionFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof Subsection> {
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
