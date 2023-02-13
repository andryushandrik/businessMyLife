import UserService from 'App/Services/User/UserService'
import User from 'App/Models/User/User'
// * Types
import { Err } from 'Contracts/response'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class BalanceService {
	public static async updateBalanceOfUser(userId: User['id'], balance: number): Promise<void> {
		try {
			const user: User = await UserService.get(+userId)
			await user.merge({ balance: balance }).save()
		} catch (err: Err | any) {
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}

	public static async addBalanceToUser(userId: User['id'], accrue: number): Promise<void> {
		try {
			const user: User = await UserService.get(+userId)
			await user.merge({ balance: user.balance + accrue }).save()
		} catch (err: Err | any) {
			throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
		}
	}
}
