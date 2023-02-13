import Drive from '@ioc:Adonis/Core/Drive'
import OurPartner from 'App/Models/OurPartner'
// * Types
import type { Err } from 'Contracts/response'
// * Types
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { OUR_PARTNERS_FOLDER_PATH } from 'Config/drive'
import OurPartnersValidator from 'App/Validators/OurPartnersValidator'
import { PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export default class OurPartnersService {
	public static async paginate(config: PaginateConfig<OurPartner>): Promise<ModelPaginatorContract<OurPartner>> {
		try {
			return await OurPartner.query().getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: OurPartner['id'], { trx }: ServiceConfig<OurPartner> = {}): Promise<OurPartner> {
		let item: OurPartner | null

		try {
			item = await OurPartner.find(id, { client: trx })
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async create(payload: OurPartnersValidator['schema']['props']): Promise<void> {
		let ad: OurPartner
		const trx: TransactionClientContract = await Database.transaction()
		try {
			ad = await OurPartner.create({ ...payload, image: 'tmp' }, { client: trx })
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
	}

	public static async update(id: OurPartner['id'], payload: OurPartnersValidator['schema']['props']): Promise<void> {
		let partner: OurPartner
		const trx: TransactionClientContract = await Database.transaction()

		try {
			partner = await this.get(id, { trx })
		} catch (err: Err | any) {
			trx.rollback()

			throw err
		}

		try {
			await partner.merge({ ...payload, image: partner.image }).save()
		} catch (err: any) {
			trx.rollback()

			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (payload.image) {
			if (partner.image) await Drive.delete(partner.image)

			try {
				const uploadedFilePath: string = await this.uploadImage(partner.id, payload.image)
				await partner.merge({ image: uploadedFilePath }).save()
			} catch (err: Err | any) {
				trx.rollback()

				Logger.error(err)
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
			}
		}

		await trx.commit()
	}

	private static async uploadImage(id: OurPartner['id'], image: MultipartFileContract): Promise<string> {
		const fileName = `${id}_${image.clientName}`

		try {
			await image.moveToDisk(OUR_PARTNERS_FOLDER_PATH, { name: fileName })
			return `${OUR_PARTNERS_FOLDER_PATH}/${fileName}`
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async delete(id: OurPartner['id']): Promise<void> {
		console.log('in deleting')
		let item: OurPartner

		try {
			item = await this.get(id)
			console.log('получили айтм', item)
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
