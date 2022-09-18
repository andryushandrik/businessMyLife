import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import NewsService from "App/Services/NewsService";
import Logger from "@ioc:Adonis/Core/Logger";
import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";

export default class NewsController {
  public async index({ view, request }: HttpContextContract) {
    const queryStringParams = request.qs();
    const page = queryStringParams.page ? queryStringParams.page : 1;

    try {
      const news: ModelPaginatorContract<News> = await NewsService.paginateNews(
        { page }
      );

      return view.render("./pages/news/index", { news });
    } catch (error: any) {
      Logger.error(error);
      throw new Error();
    }
  }

  public async showOne({
    view,
    response,
    session,
    params,
  }: HttpContextContract) {
    let newsItem: News;

    try {
      newsItem = await NewsService.get(params.id);
    } catch (error: any) {
      session.flash({ error: error.message });
      response.redirect("/news");
      return;
    }

    return view.render("./pages/news/show", { item: newsItem });
  }

  public async create({ request, response, session }: HttpContextContract) {
    let payload = await request.validate(NewsValidator);
    try {
      await NewsService.create(payload);

      session.flash({ success: "Новость добавлена" });
      response.redirect("/news");
    } catch (error: any) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async showCreate({ view, session, response }: HttpContextContract) {
    try {
      return view.render("./pages/news/create");
    } catch (error: any) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async edit({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(NewsValidator);
    const { id } = request.params();

    try {
      await NewsService.edit(id as number, payload);

      session.flash({ success: "Новость отредактирована" });
      response.redirect("/news");
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
    const newsId = parseInt(params.id);

    let newsItem: News;

    try {
      newsItem = await NewsService.get(newsId);
    } catch (error) {
      session.flash(error.message);
      response.redirect().back();
      return;
    }

    return view.render("./pages/news/edit", { item: newsItem });
  }

  public async delete({ request, response, session }: HttpContextContract) {
    const params = request.params();

    if (!parseInt(params.id)) {
      session.flash({ error: "Что-то пошло не так" });
      response.redirect().back();
      return;
    }

    try {
      await NewsService.delete(parseInt(params.id));
      session.flash({ success: "Новость была удалена" });
      response.redirect().back();
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }
}
