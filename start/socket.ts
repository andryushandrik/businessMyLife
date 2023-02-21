import type { AllSockets, SomeSocket } from 'Contracts/webSocket'
import type { ReturnMessageCreatePayload } from 'Contracts/message'
import ConversationsController from 'App/Controllers/WebSocket/Api/Chat/ConversationsController'
import MessagesController from 'App/Controllers/WebSocket/Api/Chat/MessagesController'
import Conversation from 'App/Models/Chat/Conversation'
import Message from 'App/Models/Chat/Message'
import User from 'App/Models/User/User'
import ConversationService from 'App/Services/Chat/ConversationService'
import MessageService from 'App/Services/Chat/MessageService'
import ResponseService from 'App/Services/ResponseService'
import TokenService from 'App/Services/TokenService'
import WebSocketService from 'App/Services/WebSocketService'
import authConfig from 'Config/auth'
import { ResponseMessages } from 'Config/response'
import { UserTokenPayload } from 'Contracts/token'
import { getToken } from 'Helpers/index'
import { Socket } from 'socket.io'
import { Err as HttpError } from 'Contracts/response'
import ConversationFindPayloadValidator from 'App/Validators/Chat/ConversationFindPayloadValidator'

export const ALL_SOCKETS: AllSockets = {
	sockets: <SomeSocket[]>[],
	getAllUsersSockets(this: AllSockets, userId: User['id']): SomeSocket[] | undefined {
		return this.sockets.filter((socket: SomeSocket) => socket.userId === userId)
	},
	getSocket(this: AllSockets, userId: User['id']): SomeSocket | undefined {
		return this.sockets.find((item: SomeSocket) => item.userId === userId)
	},
	addSocket(this: AllSockets, socket: SomeSocket): void {
		this.sockets.push(socket)
	},
	removeSocket(this: AllSockets, userId: User['id']): void {
		const index: number = this.sockets.findIndex((item: SomeSocket) => item.userId === userId)
		this.sockets.splice(index, 1)
	},
}

WebSocketService.boot()

WebSocketService.io.on('connection', async (socket) => {
	await checkConnection()
	sendUnreadConversationsCountToSender(socket)

	/**
	 * * Conversation
	 */

	socket.on('conversation:paginate', async (payload: any, cb: (response: HttpError | ResponseService) => void) => {
		ConversationsController.paginate(socket.data.userId!, payload, cb)
	})
	// socket.on('conversation:blockUser', async (conversationId: Conversation['id'], cb: (response: HttpError | ResponseService) => void) => {
	// 	const currentUserId: User['id'] = socket.data.userId!

	// 	const conversation: Conversation | void = await ConversationsController.get(conversationId, currentUserId, cb)
	// 	if (conversation) {
	// 		if (currentUserId !== conversation.fromId) {
	// 			ConversationsController.blockUser({ fromId: currentUserId, toId: conversation.fromId }, cb)
	// 		} else if (currentUserId !== conversation.toId) {
	// 			ConversationsController.blockUser({ fromId: currentUserId, toId: conversation.toId }, cb)
	// 		}
	// 	}
	// })

	socket.on('conversation:get', async (conversationId: Conversation['id'], cb: (response: HttpError | ResponseService) => void) => {
		const currentUserId: User['id'] = socket.data.userId!
		const conversation: Conversation | void = await ConversationsController.get(conversationId, currentUserId, cb)

		if (conversation) {
			const usersIds: User['id'][] = [conversation.fromId, conversation.toId]
			// const conversationRoomName: string = getConversationRoomName(conversation.id)
			// await socket.join(conversationRoomName)
			//await emitCountConversationsWithNewMessages()
			sendUnreadConversationsCountToSender(socket)

			//await sendMessageViewedForMessageCreator(conversation.id, conversation.lastMessage.userId)

			for (const item of usersIds) {
				const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(item)

				if (someSocket) socket.to(someSocket.socketId).emit('conversation:update', conversation)
			}
		}
	})

	socket.on('conversation:getByUserId', async (userId: User['id'], cb: (response: HttpError | ResponseService) => void) => {
		const currentUserId: User['id'] = socket.data.userId!
		const conversation: Conversation | void = await ConversationsController.getByUsersId(userId, currentUserId, cb)

		if (conversation) {
			const usersIds: User['id'][] = [conversation.fromId, conversation.toId]
			// const conversationRoomName: string = getConversationRoomName(conversation.id)

			// await socket.join(conversationRoomName)
			// await emitCountConversationsWithNewMessages()
			sendUnreadConversationsCountToSender(socket)

			//await sendMessageViewedForMessageCreator(conversation.id, conversation.lastMessage.userId)

			for (const item of usersIds) {
				const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(item)

				if (someSocket) socket.to(someSocket.socketId).emit('conversation:update', conversation)
			}
		}
	})

	// socket.on('conversation:getWithLotTopic', async (lotId: Lot['id'], cb: (response: HttpError | ResponseService) => void) => {
	//   const currentUserId: User['id'] = socket.data.userId!
	//   const conversation: Conversation | void = await ConversationsController.get(lotId, currentUserId, cb)

	//   if (conversation) {
	//     const usersIds: User['id'][] = [conversation.fromId, conversation.toId]
	//     const conversationRoomName: string = getConversationRoomName(conversation.id)

	//     await socket.join(conversationRoomName)
	//     await emitCountConversationsWithNewMessages()
	//     await sendMessageViewedForMessageCreator(conversation.id, conversation.lastMessage.userId)

	//     for (const item of usersIds) {
	//       const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(item)

	//       if (someSocket)
	//         socket.to(someSocket.socketId).emit('conversation:update', conversation)
	//     }
	//   }
	// })

	socket.on('conversation:delete', async (conversationId: Conversation['id'], cb: (response: HttpError | ResponseService) => void) => {
		const currentUserId: User['id'] = socket.data.userId!

		ConversationsController.delete(currentUserId, conversationId, cb)
	})

	// socket.on(
	// 	'conversation:close',
	// 	async (
	// 		conversationId: Conversation['id'],
	// 		cb: (response: HttpError | ResponseService) => void,
	// 	) => {
	// 		// const conversationRoomName: string = getConversationRoomName(conversationId)
	// 		// await socket.leave(conversationRoomName)

	// 		cb(new ResponseService(ResponseMessages.SUCCESS))
	// 	},
	// )

	/**
	 * * Message
	 */

	socket.on('message:paginate', async (conversationFindPayload: any, apiPayload: any, cb: (response: HttpError | ResponseService) => void) => {
		const currentUserId = socket.data.userId

		MessagesController.paginate(conversationFindPayload, apiPayload, currentUserId!, cb)
	})

	socket.on('message:create', async (payload: any, cb: (response: HttpError | ResponseService) => void) => {
		const senderId: User['id'] = socket.data.userId!

		const data: ReturnMessageCreatePayload | void = await MessagesController.create(senderId!, payload, cb)

		if (data) {
			const message: Message = data.message
			const conversation: Conversation = data.conversation
			const receiverId: User['id'] = conversation.toId != senderId ? conversation.toId : conversation.fromId
			const usersIds: User['id'][] = [senderId, receiverId]

			sendMessageViaSocket(socket, usersIds, 'message:create', message)
			markConversationAsReadedByCurrentUser(socket, conversation)
			sendUnreadConversationsCountToSender(socket)
			sendUnreadConversationsCountToReciever(receiverId)
			// for (const userId of usersIds) {
			// 	const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(userId)

			// 	if (someSocket) {
			// 		await emitCountConversationsWithNewMessages(someSocket.userId, someSocket.socketId)

			// 		socket.to(someSocket.socketId).emit(
			// 			'conversation:update',
			// 			await ConversationService.getById(data.conversation.id, {
			// 				currentUser: someSocket.userId,
			// 			}),
			// 		)
			// 	}
			// }
		}
	})

	socket.on(
		'message:viewed',
		async (conversationFindPayload: ConversationFindPayloadValidator['schema']['props'], cb: (response: HttpError | ResponseService) => void) => {
			const currentUserId = socket.data.userId!
			const conversation = await ConversationsController.find(conversationFindPayload, currentUserId)
			await markConversationAsReadedByCurrentUser(socket, conversation)

			cb(new ResponseService(ResponseMessages.SUCCESS))
		},
	)

	/**
	 * * Other
	 */

	socket.on('disconnect', () => {
		const userRoomName = getUserRoomName(socket.data.userId!)
		socket.leave(userRoomName)
		ALL_SOCKETS.removeSocket(socket.data.userId!)
	})

	async function checkConnection(): Promise<void> {
		let userId: number
		const authHeader = socket.handshake.auth.token || socket.handshake.headers['authorization']

		if (!authHeader) {
			socket.disconnect()
			return
		}

		try {
			const authToken: string = getToken(authHeader)

			const payload: UserTokenPayload = TokenService.verifyToken<UserTokenPayload>(authToken, authConfig.access.key)

			userId = payload.id
		} catch {
			socket.disconnect()
			return
		}

		if (!userId) {
			socket.disconnect()
			return
		}

		// on sucessfully connection actions
		socket.data.userId = userId
		ALL_SOCKETS.addSocket({
			userId,
			socketId: socket.id,
		})

		const userRoomName = getUserRoomName(socket.data.userId)
		socket.join(userRoomName)
		// on sucessfully connection actions end
	}

	// function checkIsSocketsRemains(userId: number): boolean {
	// 	const usersSockets = ALL_SOCKETS.getAllUsersSockets(userId)
	// 	console.log('usersSockets') //dev
	// 	console.log(usersSockets) //dev

	// 	if (usersSockets) {
	// 		if (usersSockets?.length > 0) {
	// 			return true
	// 		}
	// 	}
	// 	return false
	// }

	// async function emitCountConversationsWithNewMessages(
	// 	userId?: User['id'],
	// 	room?: string,
	// ): Promise<void> {
	// 	userId = userId ?? socket.data.userId!
	// 	const eventName: keyof ServerToClientEvents = 'conversation:countNewMessages'
	// 	const countNewMessages: number = await ConversationService.getConversationsWithNewMessages(
	// 		userId,
	// 	)

	// 	if (room) socket.to(room).emit(eventName, countNewMessages)
	// 	else socket.emit(eventName, countNewMessages)
	// }
})

async function sendMessageViaSocket(socket: Socket, usersIds: Array<User['id']>, eventName: string, message: Message) {
	const roomNames = getUsersRoomsNames(usersIds)
	console.log(roomNames)

	socket.to(roomNames).emit(eventName, message)
}

async function markConversationAsReadedByCurrentUser(socket: Socket, conversation: Conversation) {
	const currentUserId = socket.data.userId!
	const authorId = conversation.toId == currentUserId ? conversation.fromId : conversation.toId
	const usersIds: User['id'][] = [currentUserId, authorId]
	const roomNames = getUsersRoomsNames(usersIds)
	const payload: ConversationFindPayloadValidator['schema']['props'] = {
		conversationId: conversation.id,
		userId: currentUserId,
	}
	MessageService.viewed(conversation, currentUserId)
	socket.to(roomNames).emit('message:viewed', payload)
}

async function sendUnreadConversationsCountToSender(socket: Socket) {
	const currentUserId = socket.data.userId!
	let countNewMessages: number | string = await ConversationService.getConversationsWithNewMessages(currentUserId)
	const roomName = getUserRoomName(currentUserId)
	if (0 == countNewMessages) countNewMessages = ''
	WebSocketService.io.to(roomName).emit('conversation:unreadCount', { unreadCount: countNewMessages })
}

async function sendUnreadConversationsCountToReciever(receiverId: User['id']) {
	let countNewMessages: number | string = await ConversationService.getConversationsWithNewMessages(receiverId)
	const roomName = getUserRoomName(receiverId)
	if (0 == countNewMessages) countNewMessages = ''
	WebSocketService.io.to(roomName).emit('conversation:unreadCount', { unreadCount: countNewMessages })
}

// async function sendUnreadMessagesCount(
// 	socket: Socket,
// 	conversation: Conversation
// ) {
// 	const currentUserId = socket.data.userId!
// 	const countNewMessages: number = await ConversationService.getConversationsWithNewMessages(
// 		currentUserId,
// 	)
// 	const roomName = getUserRoomName(currentUserId)
// 	WebSocketService.io.to(roomName).emit('message:unreadCount', countNewMessages)
// }

export function getUserRoomName(id: User['id']): string {
	return `userSockets-${id}`
}

export function getUsersRoomsNames(usersIds: Array<User['id']>): Array<string> {
	const roomNames: Array<string> = []
	usersIds.map((userId) => {
		roomNames.push(`userSockets-${userId}`)
	})
	return roomNames
}
