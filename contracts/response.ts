// * Types
import type { ResponseCodes, ResponseMessages } from 'Config/response'
// * Types

export type Err = { // Error name is global and already in use
  code: ResponseCodes,
  message: ResponseMessages,
  body?: any,
  errors?: any,
}
