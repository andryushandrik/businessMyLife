import Drive from '@ioc:Adonis/Core/Drive'
import Advertisement from 'App/Models/Advertisement'
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

export default class AdvertisementService {
	public static async create(payload: AdvertisementValidator['schema']['props']): Promise<void> {
		let ad: Advertisement
		const trx: TransactionClientContract = await Database.transaction()
		try {
			ad = await Advertisement.create({ ...payload, offerImage: 'tmp', subsectionImage: 'tmp' }, { client: trx })
		} catch (err: any) {
			trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
		if (payload.offerImage) {
			try {
				const filePath: string = await this.uploadImage(ad.id, payload.offerImage, 'offer')
				await ad.merge({ offerImage: filePath }).save()
			} catch (err: Err | any) {
				trx.rollback()

				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}
		if (payload.subsectionImage) {
			try {
				const filePath: string = await this.uploadImage(ad.id, payload.subsectionImage, 'subsection')
				await ad.merge({ offerImage: filePath }).save()
			} catch (err: Err | any) {
				trx.rollback()

				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}

		await trx.commit()
	}

	public static async paginate(config: PaginateConfig<Advertisement>): Promise<ModelPaginatorContract<Advertisement>> {
		try {
			return await Advertisement.query().preload('owner').getViaPaginate(config)
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

	public static async update(id: Advertisement['id'], payload: AdvertisementValidator['schema']['props']): Promise<void> {
		let ad: Advertisement
		const trx: TransactionClientContract = await Database.transaction()

		try {
			ad = await this.get(id, { trx })
		} catch (err: Err | any) {
			trx.rollback()

			throw err
		}

		try {
			await ad.merge({ ...payload, offerImage: ad.offerImage, subsectionImage: ad.subsectionImage }).save()
		} catch (err: any) {
			trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (payload.offerImage) {
			if (ad.offerImage) await Drive.delete(ad.offerImage)

			try {
				const uploadedFilePath: string = await this.uploadImage(ad.id, payload.offerImage, 'offer')
				await ad.merge({ offerImage: uploadedFilePath }).save()
			} catch (err: Err | any) {
				trx.rollback()

				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}

		if (payload.subsectionImage) {
			if (ad.subsectionImage) await Drive.delete(ad.subsectionImage)

			try {
				const uploadedFilePath: string = await this.uploadImage(ad.id, payload.subsectionImage, 'subsection')
				await ad.merge({ subsectionImage: uploadedFilePath }).save()
			} catch (err: Err | any) {
				trx.rollback()

				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}

		await trx.commit()
	}

	private static async uploadImage(id: Advertisement['id'], image: MultipartFileContract, additionalPath: string): Promise<string> {
		const fileName = `${id}_${image.clientName}`

		try {
			await image.moveToDisk(ADVERTISEMENT_FOLDER_PATH + '/' + additionalPath + '/', { name: fileName })
			return `${ADVERTISEMENT_FOLDER_PATH}/${additionalPath}/${fileName}`
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
	public static async get(id: Advertisement['id'], { trx }: ServiceConfig<Advertisement> = {}): Promise<Advertisement> {
		let item: Advertisement | null

		try {
			item = await Advertisement.find(id, { client: trx })
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
}
