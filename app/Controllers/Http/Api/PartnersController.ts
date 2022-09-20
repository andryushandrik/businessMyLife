// * Types
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import ResponseService from 'App/Services/ResponseService'
import PartnersService from 'App/Services/PartnersService'
import Partner from 'App/Models/Partner'

export default class PartnersController{
    public async paginate({request, response}: HttpContextContract){
        let payload: ApiValidator['schema']['props']

        try {
            payload = await request.validate(ApiValidator)
        } catch (error: Err | any) {
            throw new ExceptionService({
                code: ResponseCodes.VALIDATION_ERROR,
                message: ResponseMessages.VALIDATION_ERROR,
                body: error.messages
            })
        }

        try {
            const partners: ModelPaginatorContract<Partner> = await PartnersService.paginatePartners(payload)
            return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, partners))
        } catch (error: Err | any) {
            throw new ExceptionService(error)
        }
    }

    public async get({request, response}: HttpContextContract){
        const id: number = request.param('id', 1)

        try {
            const item = await PartnersService.get(id)
            return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
        } catch (error: Err | any) {
            throw new ExceptionService(error)
        }
    }
}