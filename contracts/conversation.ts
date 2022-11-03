// * Types
import type User from 'App/Models/User/User'
import type Offer from 'App/Models/Offer/Offer'
// * Types

export type ConversationGetPayload = {
  toId: User['id'],
  fromId: User['id'],
  offerId?: Offer['id'],
}

export type ConversationGetWithoutTopicPayload = {
  toId: User['id'],
  fromId: User['id'],
}
