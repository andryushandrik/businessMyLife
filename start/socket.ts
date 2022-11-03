// * Types
import type User from 'App/Models/User/User'
import type Conversation from 'App/Models/Chat/Conversation'
import type { Err } from 'Contracts/response'
import type { AllSockets, ServerToClientEvents, SomeSocket } from 'Contracts/webSocket'
import type { MessageCreateWithoutTopicPayload, ReturnMessageCreatePayload } from 'Contracts/message'
// * Types

import ResponseService from 'App/Services/ResponseService'
import WebSocketService from 'App/Services/WebSocketService'
import ConversationService from 'App/Services/Chat/ConversationService'
import IndexController from 'App/Controllers/WebSocket/Api/IndexController'
import MessagesController from 'App/Controllers/WebSocket/Api/Chat/MessagesController'
import ConversationsController from 'App/Controllers/WebSocket/Api/Chat/ConversationsController'
import { ResponseMessages } from 'Config/response'
import { getConversationRoomName } from 'Helpers/index'

const ALL_SOCKETS: AllSockets = {
  sockets: [],
  getSocket(userId: User['id']): SomeSocket | undefined {
    const ctx: AllSockets = this // For types

    return ctx.sockets.find((item: SomeSocket) => item.userId == userId)
  },
  addSocket(socket: SomeSocket): void {
    const ctx: AllSockets = this // For types

    ctx.sockets.push(socket)
  },
  removeSocket(userId: User['id']): void {
    const ctx: AllSockets = this // For types
    const index: number = ctx.sockets.findIndex((item: SomeSocket) => item.userId == userId)

    ctx.sockets.splice(index, 1)
  },
}

WebSocketService.boot()

WebSocketService.io.on('connection', async (socket) => {

  await checkConnection()

  /**
   * * Conversation
   */

  socket.on('conversation:paginate', async (payload: any, cb: (response: Err | ResponseService) => void) => {
    ConversationsController.paginate(socket.data.userId!, payload, cb)
  })

  socket.on('conversation:get', async (conversationId: Conversation['id'], cb: (response: Err | ResponseService) => void) => {
    const currentUserId: User['id'] = socket.data.userId!
    const conversation: Conversation | void = await ConversationsController.get(conversationId, currentUserId, cb)

    if (conversation) {
      const usersIds: User['id'][] = [conversation.fromId, conversation.toId]
      const conversationRoomName: string = getConversationRoomName(conversation.id)

      await socket.join(conversationRoomName)
      await emitCountConversationsWithNewMessages()
      await sendMessageViewedForMessageCreator(conversation.id, conversation.lastMessage.userId)

      for (const item of usersIds) {
        const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(item)

        if (someSocket)
          socket.to(someSocket.socketId).emit('conversation:update', conversation)
      }
    }
  })

  socket.on('conversation:delete', async (conversationId: Conversation['id'], cb: (response: Err | ResponseService) => void) => {
    ConversationsController.delete(conversationId, cb)
  })

  socket.on('conversation:close', async (conversationId: Conversation['id'], cb: (response: Err | ResponseService) => void) => {
    const conversationRoomName: string = getConversationRoomName(conversationId)
    await socket.leave(conversationRoomName)

    cb(new ResponseService(ResponseMessages.SUCCESS))
  })

  /**
   * * Message
   */

  socket.on('message:paginate', async (conversationId: Conversation['id'], apiPayload: any, cb: (response: Err | ResponseService) => void) => {
    MessagesController.paginate(conversationId, apiPayload, cb)
  })

  socket.on('message:create', async (payload: any, cb: (response: Err | ResponseService) => void) => {
    const data: ReturnMessageCreatePayload | void = await MessagesController.create(socket.data.userId!, payload, cb)

    if (data) {
      const usersIds: User['id'][] = [data.conversation.fromId, data.conversation.toId]
      const conversationRoomName: string = getConversationRoomName(data.message.conversationId)

      socket.to(conversationRoomName).emit('message:create', data.message)

      for (const item of usersIds) {
        const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(item)

        if (someSocket) {
          await emitCountConversationsWithNewMessages(someSocket.userId, someSocket.socketId)

          socket.to(someSocket.socketId).emit('conversation:update', await ConversationService.get(data.conversation.id, { currentUser: someSocket.userId }))
        }
      }
    }
  })

  socket.on('message:createWithoutTopic', async (toId: User['id'], payload: any, cb: (response: Err | ResponseService) => void) => {
    const createPayload: MessageCreateWithoutTopicPayload = {
      toId,
      fromId: socket.data.userId!,
    }

    const data: ReturnMessageCreatePayload | void = await MessagesController.createWithoutTopic(payload, createPayload, cb)

    if (data) {
      const usersIds: User['id'][] = [data.conversation.fromId, data.conversation.toId]
      const conversationRoomName: string = getConversationRoomName(data.message.conversationId)

      socket.to(conversationRoomName).emit('message:create', data.message)

      for (const item of usersIds) {
        const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(item)

        if (someSocket) {
          await emitCountConversationsWithNewMessages(someSocket.userId, someSocket.socketId)

          socket.to(someSocket.socketId).emit('conversation:update', await ConversationService.get(data.conversation.id, { currentUser: someSocket.userId }))
        }
      }
    }
  })

  socket.on('message:createWithOfferTopic', async (toId: User['id'], payload: any, cb: (response: Err | ResponseService) => void) => {
    const createPayload: MessageCreateWithoutTopicPayload = {
      toId,
      fromId: socket.data.userId!,
    }

    const data: ReturnMessageCreatePayload | void = await MessagesController.createWithOfferTopic(payload, createPayload, cb)

    if (data) {
      const usersIds: User['id'][] = [data.conversation.fromId, data.conversation.toId]
      const conversationRoomName: string = getConversationRoomName(data.message.conversationId)

      socket.to(conversationRoomName).emit('message:create', data.message)

      for (const item of usersIds) {
        const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(item)

        if (someSocket) {
          await emitCountConversationsWithNewMessages(someSocket.userId, someSocket.socketId)

          socket.to(someSocket.socketId).emit('conversation:update', await ConversationService.get(data.conversation.id, { currentUser: someSocket.userId }))
        }
      }
    }
  })

  socket.on('message:viewed', async (conversationId: Conversation['id'], userId: User['id'], cb: (response: Err | ResponseService) => void) => {
    await sendMessageViewedForMessageCreator(conversationId, userId)

    cb(new ResponseService(ResponseMessages.SUCCESS))
  })

  /**
   * * Other
   */

  socket.on('disconnect', () => {
    ALL_SOCKETS.removeSocket(socket.data.userId!)
  })

  async function checkConnection(): Promise<void> {
    const userId: any = socket.handshake.query.userId

    if (!userId)
      socket.disconnect()

    const result: boolean = await IndexController.connect(Number(userId))

    if (!result) {
      socket.disconnect()
      return
    }

    socket.data.userId = userId
    ALL_SOCKETS.addSocket({
      userId,
      socketId: socket.id,
    })
  }

  async function emitCountConversationsWithNewMessages(userId?: User['id'], room?: string): Promise<void> {
    userId = userId ?? socket.data.userId!
    const eventName: keyof ServerToClientEvents = 'conversation:countNewMessages'
    const countNewMessages: number = await ConversationService.getConversationsWithNewMessages(userId)

    if (room)
      socket.to(room).emit(eventName, countNewMessages)
    else
      socket.emit(eventName, countNewMessages)
  }

  async function sendMessageViewedForMessageCreator(conversationId: Conversation['id'], userId: User['id']): Promise<void> {
    const someSocket: SomeSocket | undefined = ALL_SOCKETS.getSocket(userId)
    const allSockets: Set<string> = await socket.in(getConversationRoomName(conversationId)).allSockets()

    if (someSocket && allSockets.has(someSocket.socketId))
      socket.to(someSocket.socketId).emit('message:viewed')
  }

})
