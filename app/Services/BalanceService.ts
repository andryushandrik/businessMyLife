import User from 'App/Models/User/User'
// * Types
import { Err } from 'Contracts/response'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import PaymentService from './PaymentService'
import UserService from './User/UserService'

export default class BalanceService {
	public static async updateBalanceOfUser(userId: User['id'], balance: number): Promise<void> {
		try {
			const user: User = await UserService.get(+userId)
			await PaymentService.create({
				description: `Администратор установил баланс для пользователя ${userId} равный ${balance} `,
				amount: balance,
				userId: userId,
				promocodeId: null,
			})
			await user.merge({ balance: balance }).save()
		} catch (err: Err | any) {
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async buy(userId: User['id'], description: string, price: number): Promise<void> {
		try {
			const user: User = await UserService.get(+userId)
			if (user.balance - price >= 0) {
				console.log('BALANCE IS GOOD')
				await PaymentService.create({
					description,
					amount: -price,
					userId: userId,
					promocodeId: null,
				})
				await user.merge({ balance: user.balance - price }).save()
			} else {
				throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NOT_ENOUGH_BALANCE_ERROR } as Err
			}
		} catch (err: Err | any) {
			// throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NOT_ENOUGH_BALANCE_ERROR } as Err
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
			})
			await user.merge({ balance: user.balance + accrue }).save()
		} catch (err: Err | any) {
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}

