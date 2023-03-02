import { PaymentStatuses } from './../../config/payment';
import User  from 'App/Models/User/User';
import PremiumFranchise from 'App/Models/Offer/PremiumFranchise'
import Logger from '@ioc:Adonis/Core/Logger'
import { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import PremiumSlot from 'App/Models/Offer/PremiumSlot'
import EmployeeSlotValidator from 'App/Validators/Offer/EmployeePremiumSlotValidator'
import PremiumSlotsFilterValidator from 'App/Validators/PremiumSlots/PremiumSlotsFilterValidator'
import PremiumSlotsValidator from 'App/Validators/PremiumSlots/PremiumSlotsValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'
import { PaginateConfig } from 'Contracts/services'
import PremiumFranchiseService from './Offer/PremiumFranchiseService'
import BalanceService from './BalanceService'

export default class PremiumSlotService {
	public static async paginate(
		config: PaginateConfig<PremiumSlot>,
		filter?: PremiumSlotsFilterValidator['schema']['props'],
	): Promise<ModelPaginatorContract<PremiumSlot>> {
		let query: ModelQueryBuilderContract<typeof PremiumSlot> = PremiumSlot.query()
		if (filter) query = this.filter(query, filter)
		query.preload('premiumFranchise', (query) => {
			query.preload('offer')
		})
		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: PremiumSlot['id']): Promise<PremiumSlot> {
		let item: PremiumSlot | null

		try {
			item = await PremiumSlot.find(id)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async employee(currentUserId: User['id'], payload: EmployeeSlotValidator['schema']['props']): Promise<void> {
		try {
			const premiumFranchise: PremiumFranchise = await PremiumFranchiseService.get(payload.premiumFranchiseId)
			const premiumSlot: PremiumSlot = await PremiumSlotService.get(payload.premiumSlotId)
			if (premiumSlot.isBlocked) {
				throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.FORBIDDEN } as Err
			}
			const employedUntill = premiumFranchise.offer.createdAt.plus({ months: premiumFranchise.offer.placedForMonths })
      let price = 1000
      if(premiumFranchise.offer.placedForMonths == 3){
        price = premiumSlot.priceThreeMonths
      } else if(premiumFranchise.offer.placedForMonths == 6){
        price = premiumSlot.priceSixMonths
      }
      const paymentDescription = `Пользователь ${currentUserId}  для премиальной франшизы ${ payload.premiumFranchiseId} купил размещение на слоте ${premiumSlot} на ${premiumFranchise.offer.placedForMonths} месяцев за ${price}`
      await BalanceService.buy(currentUserId, paymentDescription, price)

			this.update(payload.premiumSlotId, {
				...premiumSlot,
				franchiseId: premiumFranchise.id,
				employedAt: premiumFranchise.offer.createdAt,
				employedUntill: employedUntill,
			})
      await PremiumFranchiseService.update(premiumFranchise.id, {paymentStatus: PaymentStatuses.SUCCESS})
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async free(premiumSlotId: number): Promise<void> {
		try {
			const premiumSlot: PremiumSlot = await PremiumSlotService.get(premiumSlotId)

			this.update(premiumSlotId, {
				...premiumSlot,
				franchiseId: null,
				employedAt: null,
				employedUntill: null,
			})
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async create(payload: PremiumSlotsValidator['schema']['props']): Promise<void> {
		try {
			await PremiumSlot.create(payload)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async update(id: PremiumSlot['id'], payload: PremiumSlotsValidator['schema']['props']): Promise<void> {
		let item: PremiumSlot

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

	public static async delete(id: PremiumSlot['id']): Promise<void> {
		let item: PremiumSlot

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
		query: ModelQueryBuilderContract<typeof PremiumSlot>,
		payload: PremiumSlotsFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof PremiumSlot> {
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
