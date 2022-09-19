import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PartnersService from "App/Services/PartnersService";
import PartnerWithImageValidator from "./../../Validators/partnersValidators/PartnerWithImageValidator";
import PartnerWithVideoValidator from "./../../Validators/partnersValidators/PartnerWithVideoValidator";
import Partner from "./../../Models/Partner";
import {
  PARTNER_IMAGE_MEDIA_TYPE,
  PARTNER_VIDEO_MEDIA_TYPE,
} from "Config/database";

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
      return view.render("./pages/partners/index", { items: partners });
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async showOne({
    view,
    params,
    session,
    response,
  }: HttpContextContract) {
    const id: number = params.id;
    let partner: Partner;

    try {
      partner = await PartnersService.get(id);
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect("/partners");
      return;
    }

    return view.render("./pages/partners/show", { item: partner });
  }

  public async showCreate({
    view,
    request,
    response,
    session,
  }: HttpContextContract) {
    const mediaType = request.qs().mediaType ?? PARTNER_IMAGE_MEDIA_TYPE;

    const supportedMediaTypes = ["0", "1"];
    if (!mediaType || !supportedMediaTypes.includes(mediaType))
      return response.redirect("/partners");
    try {
      return view.render("./pages/partners/create.edge", { mediaType });
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }

  public async create({ request, response, session }: HttpContextContract) {
    const mediaType: number = request.qs().mediaType ?? 0;
    let payload:
      | PartnerWithImageValidator["schema"]["props"]
      | PartnerWithVideoValidator["schema"]["props"];

    if (mediaType == 1) {
      payload = await request.validate(PartnerWithVideoValidator);

      try {
        await PartnersService.createWithVideo({
          ...payload,
          mediaType: PARTNER_VIDEO_MEDIA_TYPE,
        });
        session.flash({ success: "Партнер успешно добавлен" });
        response.redirect("/partners");
      } catch (error) {
        session.flash({ error: error.message });
        response.redirect().back();
      }
    } else {
      payload = await request.validate(PartnerWithImageValidator);

      try {
        await PartnersService.createWithImage({
          ...payload,
          mediaType: PARTNER_IMAGE_MEDIA_TYPE,
        });
        session.flash({ success: "Партнер успешно добавлен" });
        response.redirect("/partners");
      } catch (error) {
        session.flash({ error: error.message });
        response.redirect().back();
      }
    }
  }

  public async showEdit({
    request,
    response,
    view,
    session,
  }: HttpContextContract) {
    const mediaType = request.qs().mediaType ?? PARTNER_IMAGE_MEDIA_TYPE;
    const id = request.param("id");

    let partner: Partner;

    try {
      partner = await PartnersService.get(id);
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect("/partners");
      return;
    }

    return view.render("./pages/partners/edit", { item: partner, mediaType });
  }

  public async edit({ request, response, session }: HttpContextContract) {
    const mediaType: number =
      request.qs().mediaType ?? PARTNER_IMAGE_MEDIA_TYPE;
    const id = request.param("id");

    let payload:
      | PartnerWithImageValidator["schema"]["props"]
      | PartnerWithVideoValidator["schema"]["props"];

    if (mediaType == 1) {
      payload = await request.validate(PartnerWithVideoValidator);

      try {
        await PartnersService.editWithVideo(id, {
          ...payload,
          mediaType: PARTNER_VIDEO_MEDIA_TYPE,
        });
        session.flash({ success: "Партнер успешно отредактирован" });
        return response.redirect("/partners");
      } catch (error) {
        session.flash({ error: error.message });
        response.redirect().back();
      }
    } else {
      payload = await request.validate(PartnerWithImageValidator);

      try {
        await PartnersService.editWithImage(id, {
          ...payload,
          mediaType: PARTNER_IMAGE_MEDIA_TYPE,
        });
        session.flash({ success: "Партнер успешно отредактирован" });
        return response.redirect("/partners");
      } catch (error) {
        session.flash({ error: error.message });
        response.redirect().back();
      }
    }
  }

  public async delete({ params, response, session }: HttpContextContract) {
    const id: number = params.id;

    try {
      await PartnersService.delete(id);
      session.flash({ success: "Баннер был успешно удален" });
      response.redirect().back();
    } catch (error) {
      session.flash({ error: error.message });
      response.redirect().back();
    }
  }
}
