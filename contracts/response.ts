// * Types
import type { ResponseCodes, ResponseMessages } from 'Config/response'
// * Types

// Error name is global and already in use
export type Err = {
  code: ResponseCodes,
  message: ResponseMessages,
  body?: any,
  errors?: any,
}
