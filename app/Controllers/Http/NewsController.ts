import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NewsService from 'App/Services/NewsService'
import Logger from "@ioc:Adonis/Core/Logger"
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import News from 'App/Models/News'
import { getPaginationState } from 'Helpers/index'
import NewsValidator from 'App/Validators/NewsValidator'

export default class NewsController {
    public async index({view, request}: HttpContextContract){
        const queryStringParams = request.qs()
        const page = queryStringParams.page ? queryStringParams.page : 1

        try {
            const news: ModelPaginatorContract<News> = await NewsService.paginateNews({page})
            const paginationState = getPaginationState(news)

            const state = {news, ...paginationState}
            
            return view.render('news', state)
        } catch (error: any) {
            Logger.error(error)
            throw new Error()
        }
    }

    public async create({request, response}: HttpContextContract){
        let payload = await request.validate(NewsValidator)
        
        try {
            await NewsService.create(payload)
            response.status(200).json({code: 'Success'})
        } catch (error: any) {
            //Make use of the exception service later
            response.status(400).send(error.message)
        }
    }

}
