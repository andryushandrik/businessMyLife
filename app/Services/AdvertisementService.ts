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
    console.log(payload)
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
			return await Advertisement.query().getViaPaginate(config)
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
}

