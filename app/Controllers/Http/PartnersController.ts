import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PartnersService from "App/Services/PartnersService";

export default class PartnersController {
  public async index({
    view,
    request,
    response,
    session,
  }: HttpContextContract) {
    const queryStringParams = request.qs();
    const page = queryStringParams.page ? queryStringParams.page : 1;
    try {
      const partners = await PartnersService.paginatePartners({ page });
      return await view.render("./pages/partners/index", { items: partners });
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }
}
