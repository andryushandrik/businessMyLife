import User from 'App/Models/User/User'
// * Types
import { Err } from 'Contracts/response'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import PaymentService from './PaymentService'
import UserService from './User/UserService'
import { PaymentMethods, PaymentStatuses } from 'Config/payment'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'

export default class BalanceService {
	public static async updateBalanceOfUser(userId: User['id'], balance: number): Promise<void> {
		try {
			const user: User = await UserService.get(+userId)
			await PaymentService.create({
				description: `Администратор установил баланс для пользователя ${userId} равный ${balance} `,
				amount: balance,
				userId: userId,
				method: PaymentMethods.INTERNAL,
				targetTable: `${User.table}`,
				targetId: userId,
				status: PaymentStatuses.SUCCESS,
				promocodeId: null,
			})
			await user.merge({ balance: balance }).save()
		} catch (err: Err | any) {
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async buy(userId: User['id'], model: LucidModel, targetId: number, description: string, price: number, method: PaymentMethods): Promise<void> {
		try {
			console.log(userId)

			if (method === PaymentMethods.INTERNAL) {
				const user: User = await UserService.get(+userId)
				if (user.balance - price >= 0) {
					await PaymentService.create({
						description,
						amount: -price,
						userId: userId,
						promocodeId: null,
						method,
						targetTable: `${model.table}`,
						targetId,
						status: PaymentStatuses.SUCCESS,
					})
					await user.merge({ balance: user.balance - price }).save()
				} else {
					throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NOT_ENOUGH_BALANCE_ERROR } as Err
				}
			} else if (method === PaymentMethods.EXTERNAL) {
				await PaymentService.create({
					description,
					amount: -price,
					userId: userId,
					promocodeId: null,
					method,
					targetTable: `${model.table}`,
					targetId,
					status: PaymentStatuses.REJECTED,
				})
				throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.BANK_SERVICE_ERROR } as Err
			}
		} catch (err: Err | any) {
			throw err
		}
	}

	public static async addBalanceToUser(userId: User['id'], accrue: number): Promise<void> {
		try {
			const user: User = await UserService.get(+userId)
			await PaymentService.create({
				description: `Администратор изменил баланс для пользователя ${userId} на ${accrue}`,
				amount: accrue,
				userId: userId,
				promocodeId: null,
				method: PaymentMethods.INTERNAL,
				targetTable: `${User.table}`,
				targetId: userId,
				status: PaymentStatuses.SUCCESS,
			})
			await user.merge({ balance: user.balance + accrue }).save()
		} catch (err: Err | any) {
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
