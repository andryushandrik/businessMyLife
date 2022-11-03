// * Types
import type User from 'App/Models/User/User'
import type Message from 'App/Models/Chat/Message'
import type Conversation from 'App/Models/Chat/Conversation'
// * Types

export type MessageCreateWithoutTopicPayload = {
  toId: User['id'],
  fromId: User['id'],
}

export type ReturnMessageCreatePayload = {
  message: Message,
  conversation: Conversation,
}
