import PremiumFranchise from 'App/Models/Offer/PremiumFranchise'
import Logger from '@ioc:Adonis/Core/Logger'
import { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'
import { PaginateConfig } from 'Contracts/services'
import PremiumFranchiseFilterValidator from 'App/Validators/Offer/PremiumFranchiseFilterValidator'
import PremiumFranchiseValidator from 'App/Validators/Offer/PremiumFranchiseValidator'

export default class PremiumFranchiseService {
	public static async paginate(
		config: PaginateConfig<PremiumFranchise>,
		filter?: PremiumFranchiseFilterValidator['schema']['props'],
	): Promise<ModelPaginatorContract<PremiumFranchise>> {
		let query: ModelQueryBuilderContract<typeof PremiumFranchise> = PremiumFranchise.query()
		if (filter) query = this.filter(query, filter)

		query
			.preload('offer', (query) => {
				query.preload('user')
				query.preload('reports')
			})
			.preload('premiumSlot')

		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: PremiumFranchise['id']): Promise<PremiumFranchise> {
		let item: PremiumFranchise | null

		try {
			// item = await PremiumFranchise.find(id)
			item = await PremiumFranchise.query().where('id', id).preload('offer').first()
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async create(payload: PremiumFranchiseValidator['schema']['props']): Promise<void> {
		try {
			await PremiumFranchise.create(payload)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async update(id: PremiumFranchise['id'], payload: PremiumFranchiseValidator['schema']['props']): Promise<void> {
		let item: PremiumFranchise

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

	public static async delete(id: PremiumFranchise['id']): Promise<void> {
		let item: PremiumFranchise

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
		query: ModelQueryBuilderContract<typeof PremiumFranchise>,
		payload: PremiumFranchiseFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof PremiumFranchise> {
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
          case 'offerId':
						query = query.withScopes((scopes) => scopes.getByOfferId(payload[key]!))
						break

					default:
						break
				}
			}
		}

		return query
	}
}
