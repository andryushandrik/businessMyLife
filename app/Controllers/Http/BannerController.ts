import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Banner from "App/Models/Banner";
import BannerService from "App/Services/BannerService";
import BannerValidator from "App/Validators/BannerValidator";

export default class BannerController {
  public async index({
    view,
    request,
    response,
    session,
  }: HttpContextContract) {
    const queryParams = request.qs();
    const page: number = queryParams.page ?? 1;

    try {
      const bannerItems = await BannerService.paginateBanners({ page });
      return await view.render("./pages/banners/index", { items: bannerItems });
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async showOne({
    view,
    response,
    session,
    params,
  }: HttpContextContract) {
    let banner: Banner;

    try {
      banner = await BannerService.get(params.id);
    } catch (error: any) {
      session.flash({ error: error.message });
      response.redirect("/banners");
      return;
    }

    return view.render("./pages/banners/show", { item: banner });
  }

  public async showCreate({ view, session, response }) {
    try {
      return await view.render("./pages/banners/create");
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async create({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(BannerValidator);

    try {
      await BannerService.create(payload);
      session.flash({ success: "Баннер был успешно создан" });
      response.redirect("/banners");
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async edit({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(BannerValidator);
    const { id } = request.params();

    try {
      await BannerService.edit(id as number, payload);

      session.flash({ success: "Баннер отредактирован" });
      response.redirect("/banners");
    } catch (error: any) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async showEdit({
    view,
    request,
    response,
    session,
  }: HttpContextContract) {
    const params = request.params();
    const bannerId = parseInt(params.id);

    let banner: Banner;

    try {
      banner = await BannerService.get(bannerId);
    } catch (error) {
      session.flash(error.message);
      response.redirect().back();
      return;
    }

    return view.render("./pages/banners/edit", { item: banner });
  }

  public async delete({ params, response, session }: HttpContextContract) {
    const id: number = params.id;

    try {
      await BannerService.delete(id);
      session.flash({ success: "Баннер был успешно удален" });
      response.redirect().back();
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }
}
