// * Types
import type User from 'App/Models/User/User'
import type Message from 'App/Models/Chat/Message'
import type ApiValidator from 'App/Validators/ApiValidator'
import type Conversation from 'App/Models/Chat/Conversation'
import type ResponseService from 'App/Services/ResponseService'
import type MessageWithoutTopicValidator from 'App/Validators/Message/MessageWithoutTopicValidator'
import type MessageWithOfferTopicValidator from 'App/Validators/Message/MessageWithOfferTopicValidator'
import type { Err } from './response'
import type { SocketId } from 'socket.io-adapter'
// * Types

export interface ServerToClientEvents {
	/**
	 * * Conversation
	 */

	'conversation:countNewMessages': (count: number) => void
	'conversation:update': (conversation: Conversation) => void

	/**
	 * * Message
	 */

	'message:viewed': () => void
	'message:create': (message: Message) => void
}

export interface ClientToServerEvents {
	/**
	 * * Conversation
	 */

	'conversation:get': (
		conversationId: Conversation['id'],
		cb: (response: Err | ResponseService) => void,
	) => void
	'conversation:delete': (
		conversationId: Conversation['id'],
		cb: (response: Err | ResponseService) => void,
	) => void
	'conversation:paginate': (
		payload: ApiValidator['schema']['props'],
		cb: (response: Err | ResponseService) => void,
	) => void

	'conversation:close': (
		conversationId: Conversation['id'],
		cb: (response: Err | ResponseService) => void,
	) => void

	/**
	 * * Message
	 */

	'message:create': (
		payload: MessageWithoutTopicValidator['schema']['props'],
		cb: (response: Err | ResponseService) => void,
	) => void
	'message:createWithoutTopic': (
		toId: User['id'],
		payload: MessageWithoutTopicValidator['schema']['props'],
		cb: (response: Err | ResponseService) => void,
	) => void
	'message:createWithOfferTopic': (
		toId: User['id'],
		payload: MessageWithOfferTopicValidator['schema']['props'],
		cb: (response: Err | ResponseService) => void,
	) => void

	'message:viewed': (
		conversationId: Conversation['id'],
		userId: User['id'],
		cb: (response: Err | ResponseService) => void,
	) => void
	'message:paginate': (
		conversationId: Conversation['id'],
		payload: ApiValidator['schema']['props'],
		cb: (response: Err | ResponseService) => void,
	) => void
}

export interface InterServerEvents {}

export interface SocketData {
	userId: User['id']
}

export type AllSockets = {
	sockets: SomeSocket[]
	getSocket: (userId: User['id']) => SomeSocket | undefined
	addSocket: (socket: SomeSocket) => void
	removeSocket: (userId: User['id']) => void
}

export type SomeSocket = {
	userId: User['id']
	socketId: SocketId
}
