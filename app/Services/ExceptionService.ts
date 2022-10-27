// * Types
import type { Err } from 'Contracts/response'
// * Types

import TokenException from 'App/Exceptions/TokenException'
import ClientException from 'App/Exceptions/ClientException'
import MailerException from 'App/Exceptions/MailerException'
import ServerException from 'App/Exceptions/ServerException'
import DatabaseException from 'App/Exceptions/DatabaseException'
import ValidationException from 'App/Exceptions/ValidationException'
import VerifyCodeExistException from 'App/Exceptions/VerifyCodeExistException'
import { ResponseCodes } from 'Config/response'

export default class ExceptionService {
  constructor (err: Err) {
    switch (err.code) {
      case ResponseCodes.CLIENT_ERROR:
        return new ClientException(err.message, err.errors, err.body)

      case ResponseCodes.DATABASE_ERROR:
        return new DatabaseException(err.message, err.errors, err.body)

      case ResponseCodes.MAILER_ERROR:
        return new MailerException(err.message, err.errors, err.body)

      case ResponseCodes.SERVER_ERROR:
        return new ServerException(err.message, err.errors, err.body)

      case ResponseCodes.VALIDATION_ERROR:
        return new ValidationException(err.message, err.errors, err.body)

      case ResponseCodes.TOKEN_EXPIRED:
        return new TokenException(err.message, err.errors, err.body)

      case ResponseCodes.VERIFY_CODE_EXISTS:
        return new VerifyCodeExistException(err.message, err.errors, err.body)

      default:
        break
    }
  }
}
