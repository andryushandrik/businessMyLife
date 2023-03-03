import PremiumFranchise from 'App/Models/Offer/PremiumFranchise'
import Logger from '@ioc:Adonis/Core/Logger'
import { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'
import { PaginateConfig } from 'Contracts/services'
import PremiumFranchiseFilterValidator from 'App/Validators/Offer/PremiumFranchiseFilterValidator'
import PremiumFranchiseValidator from 'App/Validators/Offer/PremiumFranchiseValidator'
import PremiumSlotService from '../PremiumSlotService'
import User from 'App/Models/User/User'
import { PaymentMethods } from 'Config/payment'

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
			.preload('premiumSlots')

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

	public static async create(
		currentUserId: User['id'],
		paymentMethod: PaymentMethods,
		payload: PremiumFranchiseValidator['schema']['props'],
	): Promise<PremiumFranchise> {
		try {
      const candidate = await PremiumFranchise.findBy('offer_id', payload.offerId)
      if(candidate){
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.VALIDATION_ERROR } as Err
      }
			const premiumFranchise = await PremiumFranchise.create({ offerId: payload.offerId, placedForMonths: payload.placedForMonths })
			// вероятно, можно и не ждать, вряд ли пользователь успеет сделать запрос с только что занятым слотом
			try {
				await Promise.all(
					payload.slots.map(async (slotId) => {
						return await PremiumSlotService.employee(currentUserId, paymentMethod, {
							premiumFranchiseId: premiumFranchise.id,
							premiumSlotId: slotId,
						})
					}),
				)
			} catch (error) {
				throw error
			}

			return premiumFranchise
		} catch (err: any | Err) {
			Logger.error(err)
			throw { code: err.code, message: err.message } as Err
		}
	}

	public static async update(id: PremiumFranchise['id'], payload: Partial<PremiumFranchiseValidator['schema']['props']>): Promise<void> {
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

