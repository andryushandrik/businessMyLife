import { RequestContract } from '@ioc:Adonis/Core/Request'

declare module '@ioc:Adonis/Core/Request' {
	export interface RequestContract {
		currentUserId: number
	}
}

