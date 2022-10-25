// * Types
import type { Err } from 'Contracts/response'
// * Types

import mailConfig from 'Config/mail'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class MailerService {
  public static async sendRegisterVerificationCode(to: string, code: number): Promise<void> {
    const from: string = mailConfig.mailers.smtp.auth.user

    try{
      await Mail.send((message) => {
        message
          .to(to)
          .from(from)
          .subject(`${code} - ваш код подтверждения`)
          .htmlView('emails/registerVerify', { code })
      })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.MAILER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
