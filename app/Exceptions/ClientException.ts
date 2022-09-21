import IndexException from './IndexException'
import { ResponseCodes } from 'Config/response'

export default class ValidationException extends IndexException {
  status: number = 400
  code: ResponseCodes = ResponseCodes.CLIENT_ERROR
}
    