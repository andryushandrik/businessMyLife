import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FeedbackService from 'App/Services/FeedbackService'
import FeedbackValidator from 'App/Validators/FeedbackValidator'
import { OrderByMultipleType } from 'Contracts/database'

export default class FeedbackController{
    public async index({view, response, request, session}: HttpContextContract){
        const queryParams = request.qs()
        const page = queryParams?.page ?? 1
        const orderByColumn: OrderByMultipleType[] = [
            {column: "isCompleted", order: "asc"}, 
            {column: "id", order: "asc"}
        ]

        try {
            const feedbackItems = await FeedbackService.paginateFeedback({page, orderByColumn, orderBy: "asc"})
            
            return view.render("./pages/feedback/index", {items: feedbackItems})
        } catch (error: any) {
            session.flash({error: error.message})
            return response.redirect().back()
        }
    }

    public async showOne({view, session, params, response}: HttpContextContract){
        const id: number = params.id
        let feedbackItem: FeedbackValidator["schema"]["props"]

        try {
            feedbackItem = await FeedbackService.get(id)
            return await view.render("./pages/feedback/show", {item: feedbackItem})    
        } catch (error) {
            session.flash({error: error.message})
            return response.redirect('/feedback')
        }
    }

    public async complete({session, params, response}: HttpContextContract){
        const id: number = params.id
        
        try {
            await FeedbackService.markAsCompleted(id)
            session.flash({success: "Вопрос помечен как обработанный"}) 
            response.redirect('/feedback')   
        } catch (error) {
            session.flash({error: error.message})
            return response.redirect().back()
        }
    }

    public async delete({params, response, session}: HttpContextContract){
        const id: number = params.id

        try {
            await FeedbackService.delete(id)
            session.flash({success: "Вопрос был удален"}) 
            response.redirect().back()
        } catch (error) {
            session.flash(error.message)
            return response.redirect().back()
        }
    }
}