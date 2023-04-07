import Database  from '@ioc:Adonis/Lucid/Database';
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
// * Types
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import Payment from 'App/Models/Payment'
import PaymentFilterValidator from 'App/Validators/Payment/PaymentFilterValidator'
import PaymentValidator from 'App/Validators/Payment/PaymentValidator'

export default class PaymentService {
	public static async paginate(config: PaginateConfig<Payment>, filter?: PaymentFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Payment>> {
		let query: ModelQueryBuilderContract<typeof Payment> = Payment.query()

		if (filter) query = this.filter(query, filter)

		query = query.preload('promoCode').preload('user')
		try {
			return await query.getViaPaginate(config)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async get(id: Payment['id']): Promise<Payment> {
		let item: Payment | null

		try {
			item = await Payment.find(id)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async getByPaymentTarget(model: LucidModel, targetId: number): Promise<Payment> {
		let item: Payment | null

		try {
			item = await Payment.findBy('payment_target', `${model.table}_${targetId}`)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		if (!item) throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

		return item
	}

	public static async create(payload: PaymentValidator['schema']['props']): Promise<void> {
		try {
			await Payment.create(payload)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async update(id: Payment['id'], payload: PaymentValidator['schema']['props']): Promise<void> {
		let item: Payment

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

	public static async delete(id: Payment['id']): Promise<void> {
		let item: Payment

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


  public static async truncate(): Promise<void> {
		try {
			await Database.rawQuery('TRUNCATE payments RESTART IDENTITY;')
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	/**
	 * * Private methods
	 */

	private static filter(
		query: ModelQueryBuilderContract<typeof Payment>,
		payload: PaymentFilterValidator['schema']['props'],
	): ModelQueryBuilderContract<typeof Payment> {
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
