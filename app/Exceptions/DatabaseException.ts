import IndexException from './IndexException'
import { ResponseCodes } from 'Config/response'

export default class DatabaseException extends IndexException {
    status: number = 500
    code: ResponseCodes = ResponseCodes.DATABASE_ERROR
}