import AdvertisementFilterValidator from 'App/Validators/Ads/AdvertisementFilterValidator'
import Drive from '@ioc:Adonis/Core/Drive'
import Advertisement from 'App/Models/Ads/Advertisement'
// * Types
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
// * Types
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { LucidModel, ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import AdvertisementValidator from 'App/Validators/Ads/AdvertisementValidator'
import { ADVERTISEMENT_FOLDER_PATH } from 'Config/drive'
import { DateTime } from 'luxon'

export default class AdvertisementService {
	public static async create(payload: AdvertisementValidator['schema']['props']): Promise<Advertisement> {
		let ad: Advertisement
		const trx: TransactionClientContract = await Database.transaction()
		try {
			ad = await Advertisement.create({ ...payload, image: 'tmp', placedAt: DateTime.now() }, { client: trx })
		} catch (err: any) {
			trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
		if (payload.image) {
			try {
				const filePath: string = await this.uploadImage(ad.id, payload.image)
				await ad.merge({ image: filePath }).save()
			} catch (err: Err | any) {
				trx.rollback()

				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}
		await trx.commit()
		return ad
	}

	public static async paginate(
		config: PaginateConfig<Advertisement>,
		filter?: Partial<AdvertisementFilterValidator['schema']['props']>,
	): Promise<ModelPaginatorContract<Advertisement>> {
		try {
			let query: ModelQueryBuilderContract<typeof Advertisement> = Advertisement.query()
			if (filter) query = this.filter(query, filter)
			return await query.preload('owner').preload('subsection').preload('adsType').getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

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

	public static async update(id: Advertisement['id'], payload: Partial<AdvertisementValidator['schema']['props']>): Promise<void> {
		let ad: Advertisement
		const trx: TransactionClientContract = await Database.transaction()

		try {
			ad = await this.get(id)
		} catch (err: Err | any) {
			trx.rollback()

			throw err
		}

		try {
			await ad.merge({ ...payload, image: ad.image, placedAt: DateTime.now() }).save()
		} catch (err: any) {
			trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (payload.image) {
			if (ad.image) await Drive.delete(ad.image)

			try {
				const uploadedFilePath: string = await this.uploadImage(ad.id, payload.image)
				await ad.merge({ image: uploadedFilePath }).save()
			} catch (err: Err | any) {
				trx.rollback()

				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}

		await trx.commit()
	}

	public static async verify(id: Advertisement['id']): Promise<void> {
		let ad: Advertisement
		const trx: TransactionClientContract = await Database.transaction()

		try {
			ad = await this.get(id)
		} catch (err: Err | any) {
			trx.rollback()
			throw err
		}
		try {
			await ad.merge({ isVerified: true }).save()
		} catch (err: any) {
			trx.rollback()
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
		await trx.commit()
	}

	public static async changePaymentStatus(id: Advertisement['id'], paymentStatus: string): Promise<void> {
		let ad: Advertisement
		const trx: TransactionClientContract = await Database.transaction()

		try {
			ad = await this.get(id)
		} catch (err: Err | any) {
			trx.rollback()
			throw err
		}
		try {
			await ad.merge({ paymentStatus }).save()
		} catch (err: any) {
			trx.rollback()
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
		await trx.commit()
	}

	public static async unverify(id: Advertisement['id']): Promise<void> {
		let ad: Advertisement
		const trx: TransactionClientContract = await Database.transaction()

		try {
			ad = await this.get(id)
		} catch (err: Err | any) {
			trx.rollback()
			throw err
		}
		try {
			await ad.merge({ isVerified: false }).save()
		} catch (err: any) {
			trx.rollback()
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
		await trx.commit()
	}

	private static async uploadImage(id: Advertisement['id'], image: MultipartFileContract): Promise<string> {
		const fileName = `${id}_${image.clientName}`

		try {
			await image.moveToDisk(ADVERTISEMENT_FOLDER_PATH, { name: fileName })
			return `${ADVERTISEMENT_FOLDER_PATH}/${fileName}`
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: Advertisement['id']): Promise<Advertisement> {
		let item: Advertisement | null

		try {
			item = await Advertisement.query().where('id', id).preload('owner').preload('subsection').preload('adsType').first()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async delete(id: Advertisement['id']): Promise<void> {
		let item: Advertisement

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
	private static filter(
		query: ModelQueryBuilderContract<typeof Advertisement>,
		payload: Partial<AdvertisementFilterValidator['schema']['props']>,
	): ModelQueryBuilderContract<typeof Advertisement> {
		for (const key in payload) {
			if (payload[key] !== undefined) {
				switch (key) {
					// Skip this api's keys
					case 'page':
					case 'limit':
					case 'orderBy':
					case 'orderByColumn':
						break
					// Skip this api's keys

					case 'subsectionId':
						query = query.withScopes((scopes) => scopes.getBySubsectionId(payload[key]!))
						break

					case 'isVerified':
						query = query.withScopes((scopes) => scopes.getByIsVerified(payload[key]!))
						break
					case 'place':
						query = query.whereHas('adsType', (query) => {
							query.where('place', payload[key]!)
						})
						break
          case 'userId':
            query = query.withScopes((scopes) => scopes.getByUserId(payload[key]!))

            break
					default:
						break
				}
			}
		}

		return query
	}
}
