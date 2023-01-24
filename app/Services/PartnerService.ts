// * Types
import type PartnerFilterValidator from 'App/Validators/Partner/PartnerFilterValidator'
import type PartnerWithVideoValidator from 'App/Validators/Partner/PartnerWithVideoValidator'
import type PartnerWithImageValidator from 'App/Validators/Partner/PartnerWithImageValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Partner from 'App/Models/Partner'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import { PARTNERS_FOLDER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class PartnerService {
	public static async paginate(
		config: PaginateConfig<Partner>,
		filter?: PartnerFilterValidator['schema']['props'],
	): Promise<ModelPaginatorContract<Partner>> {
		let query: ModelQueryBuilderContract<typeof Partner> = Partner.query()

		if (filter) query = this.filter(query, filter)

		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(
		id: Partner['id'],
		{ trx }: ServiceConfig<Partner> = {},
	): Promise<Partner> {
		let item: Partner | null

		try {
			item = await Partner.find(id, { client: trx })
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async create(
		payload: (PartnerWithImageValidator | PartnerWithVideoValidator)['schema']['props'],
	): Promise<void> {
		let item: Partner
		let media: string = payload.media as string
		let trx: TransactionClientContract | undefined = undefined

		if (!payload.mediaType) {
			trx = await Database.transaction()
			media = 'tmp'
		}

		try {
			item = await Partner.create({ ...payload, media }, { client: trx })
		} catch (err: any) {
			if (trx) trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!payload.mediaType) {
			try {
				const filePath: string = await this.uploadImage(
					item.id,
					payload.media as MultipartFileContract,
				)
				await item.merge({ media: filePath }).save()

				await trx!.commit()
			} catch (err: any) {
				trx!.rollback()

				throw new Error('Произошла ошибка во время загрузки файла')
			}
		}
	}

	public static async update(
		id: Partner['id'],
		payload: (PartnerWithImageValidator | PartnerWithVideoValidator)['schema']['props'],
	): Promise<void> {
		let item: Partner
		let media: string = payload.media as string
		let trx: TransactionClientContract | undefined = undefined

		if (!payload.mediaType) {
			trx = await Database.transaction()
			media = 'tmp'
		}

		try {
			item = await this.get(id, { trx })
		} catch (err: Err | any) {
			throw err
		}

		try {
			item = await item.merge({ ...payload, media }).save()
		} catch (err: any) {
			if (trx) trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!payload.mediaType) {
			try {
				await Drive.delete(item.media)
			} catch (err: any) {
				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}

			try {
				const filePath: string = await this.uploadImage(
					item.id,
					payload.media as MultipartFileContract,
				)
				await item.merge({ media: filePath }).save()

				await trx!.commit()
			} catch (err: any) {
				trx!.rollback()

				throw new Error('Произошла ошибка во время загрузки файла')
			}
		}
	}

	public static async delete(id: Partner['id']): Promise<void> {
		let item: Partner

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

	public static async visibleAction(
		id: Partner['id'],
		isVisible: Partner['isVisible'],
	): Promise<void> {
		let item: Partner

		try {
			item = await this.get(id)
		} catch (err: Err | any) {
			throw err
		}

		try {
			await item.merge({ isVisible }).save()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	/**
	 * * Private methods
	 */

	private static async uploadImage(
		id: Partner['id'],
		image: MultipartFileContract,
	): Promise<string> {
		const fileName = `${id}_${image.clientName}`

		try {
			await image.moveToDisk(PARTNERS_FOLDER_PATH, { name: fileName })
			return `${PARTNERS_FOLDER_PATH}/${fileName}`
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	private static filter(
		query: ModelQueryBuilderContract<typeof Partner>,
		payload: PartnerFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof Partner> {
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
