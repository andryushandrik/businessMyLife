// * Types
import type { Err } from 'Contracts/response'
// * Types

import DatabaseException from 'App/Exceptions/DatabaseException'
import ValidationException from 'App/Exceptions/ValidationException'
import ClientException from 'App/Exceptions/ClientException'
import { ResponseCodes } from 'Config/response'

export default class ExceptionService {
  constructor (err: Err) {
    switch (err.code) {
      case ResponseCodes.DATABASE_ERROR:
        return new DatabaseException(err.message, err.errors, err.body)
        
      case ResponseCodes.VALIDATION_ERROR:
        return new ValidationException(err.message, err.errors, err.body)

      case ResponseCodes.CLIENT_ERROR:
        return new ClientException(err.message, err.errors, err.body)
      default:
        break
    }
  }
}