// * Types
import type UploadTutorialValidator from 'App/Validators/UploadTutorial/UploadTutorialValidator'
import type UploadTutorialFilterValidator from 'App/Validators/UploadTutorial/UploadTutorialFilterValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import type { ModelAttributes, ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import UploadTutorial from 'App/Models/UploadTutorial'
import { UPLOAD_TUTORIAL_FOLDER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class UploadTutorialService {
	public static async paginate(
		config: PaginateConfig<UploadTutorial>,
		filter?: UploadTutorialFilterValidator['schema']['props'],
	): Promise<ModelPaginatorContract<UploadTutorial>> {
		let query: ModelQueryBuilderContract<typeof UploadTutorial> = UploadTutorial.query()

		if (filter) query = this.filter(query, filter)

		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: UploadTutorial['id'], { trx }: ServiceConfig<UploadTutorial> = {}): Promise<UploadTutorial> {
		let item: UploadTutorial | null

		try {
			item = await UploadTutorial.find(id, { client: trx })
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async create(payload: UploadTutorialValidator['schema']['props']): Promise<void> {
		let item: UploadTutorial
		const media: string = payload.embed ?? 'tmp'
		let trx: TransactionClientContract | undefined = undefined
		const tutorialPayload: Partial<ModelAttributes<UploadTutorial>> = {
			media,
			isVisible: Boolean(payload.isVisible),
			isTitleLink: Boolean(payload.isTitleLink),
			isEmbed: true,
			title: payload.title,
			link: payload.link,
		}

		if (payload.video) {
			tutorialPayload.isEmbed = false
			trx = await Database.transaction()
		}

		try {
			item = await UploadTutorial.create(tutorialPayload, { client: trx })
		} catch (err: any) {
			if (trx) trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (payload.video) {
			try {
				const filePath: string = await this.uploadImage(item.id, payload.video)
				await item.merge({ media: filePath }).save()

				await trx!.commit()
			} catch (err: any) {
				trx!.rollback()

				throw new Error('Произошла ошибка во время загрузки файла')
			}
		}
	}

	public static async update(id: UploadTutorial['id'], payload: UploadTutorialValidator['schema']['props']): Promise<void> {
		let item: UploadTutorial
		let oldMedia: string
		const media: string = payload.embed ?? 'tmp'
		let trx: TransactionClientContract | undefined = undefined
		const tutorialPayload: Partial<ModelAttributes<UploadTutorial>> = {
			media,
			isVisible: Boolean(payload.isVisible),
			isTitleLink: Boolean(payload.isTitleLink),
			isEmbed: true,
			title: payload.title,
			link: payload.link,
		}

		if (payload.video) {
			tutorialPayload.isEmbed = false
			trx = await Database.transaction()
		}

		try {
			item = await this.get(id, { trx })
			oldMedia = item.media
		} catch (err: Err | any) {
			throw err
		}

		try {
			item = await item.merge(tutorialPayload).save()

			await Drive.delete(oldMedia)
		} catch (err: any) {
			if (trx) trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (payload.video) {
			try {
				const filePath: string = await this.uploadImage(item.id, payload.video)
				await item.merge({ media: filePath }).save()

				await trx!.commit()
			} catch (err: any) {
				trx!.rollback()

				throw new Error('Произошла ошибка во время загрузки файла')
			}
		}
	}

	public static async delete(id: UploadTutorial['id']): Promise<void> {
		let item: UploadTutorial

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

	private static async uploadImage(id: UploadTutorial['id'], video: MultipartFileContract): Promise<string> {
		const fileName = `${id}_${video.clientName}`

		try {
			await video.moveToDisk(UPLOAD_TUTORIAL_FOLDER_PATH, { name: fileName })
			return `${UPLOAD_TUTORIAL_FOLDER_PATH}/${fileName}`
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	private static filter(
		query: ModelQueryBuilderContract<typeof UploadTutorial>,
		payload: UploadTutorialFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof UploadTutorial> {
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
