// * Types
import type { Err } from 'Contracts/response'
// * Types

import { ResponseMessages, ResponseCodes } from 'Config/response'


type HttpResponse = Err & {
    status: number
}

export default class ResponseService{
    constructor(message: ResponseMessages, body?: HttpResponse["body"]){
        return {
            message,
            body,
            status: 200,
            code: ResponseCodes.SUCCESS
        } as HttpResponse
    }
}