// * Types
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

export default class IndexController {
  public async home({ view }: HttpContextContract) {
    return view.render('pages/index')
  }
}
