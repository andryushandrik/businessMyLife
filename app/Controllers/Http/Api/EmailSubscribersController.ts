import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmailSubscriber from 'App/Models/EmailSubscriber'
import ExceptionService from 'App/Services/ExceptionService'
import ResponseService from 'App/Services/ResponseService'
import EmailSubscriberValidator from 'App/Validators/EmailSubscriberValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { Err } from 'Contracts/response'


export default class EmailSubscribersController {
    public async create({ request, response }: HttpContextContract) {
        let payload
        console.log('EmailSubscribersController');
        
		try {
			payload = await request.validate(EmailSubscriberValidator)
		} catch (err: Err | any) {
			throw new ExceptionService({
				code: ResponseCodes.VALIDATION_ERROR,
				message: ResponseMessages.VALIDATION_ERROR,
				body: err.messages,
			})
		}


    try {
      
      const subscriber: EmailSubscriber = await EmailSubscriber.create(payload)
      console.log(subscriber);

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, subscriber))
    } catch (err: Err | any) {
      console.log(err);
      
      throw new ExceptionService(err)
    }
  }
}
