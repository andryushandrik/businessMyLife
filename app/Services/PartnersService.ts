import Partner from "App/Models/Partner";
import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import { PaginationConfig } from "Contracts/database";
import PartnerWithVideoValidator from "./../Validators/partnersValidators/PartnerWithVideoValidator";
import PartnerWithImageValidator from "./../Validators/partnersValidators/PartnerWithImageValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import type { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { PARTNERS_FOLDER_PATH } from "Config/drive";

export default class PartnersService {
  public static async paginatePartners(
    paginationConfig: PaginationConfig
  ): Promise<ModelPaginatorContract<Partner>> {
    paginationConfig.page = paginationConfig.page ?? 1;
    paginationConfig.limit = 9;
    paginationConfig.baseUrl = "/partners";

    try {
      return await Partner.query().getViaPaginate(paginationConfig);
    } catch (error) {
      throw new Error("Произошла ошибка");
    }
  }

  public static async get(id: Partner["id"]) {
    try {
      return await Partner.findOrFail(id);
    } catch (error) {
      throw new Error("Партнер не найден");
    }
  }

  public static async createWithVideo(
    payload: PartnerWithVideoValidator["schema"]["props"]
  ) {
    try {
      await Partner.create({
        ...payload,
        mediaType: Number(payload.mediaType),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public static async createWithImage(
    payload: PartnerWithImageValidator["schema"]["props"]
  ) {
    let partner: Partner;
    const trx = await Database.transaction();

    try {
      partner = await Partner.create(
        {
          ...payload,
          mediaType: Number(payload.mediaType),
          media: undefined,
        },
        { client: trx }
      );
    } catch (error) {
      await trx.rollback();
      throw new Error("Произошла ошибка во время создания партнера");
    }

    if (payload.media) {
      try {
        const filePath = await this.uploadImage(partner.id, payload.media);
        await partner.merge({ media: filePath }).save();
      } catch (error) {
        await trx.rollback();
        throw new Error("Произошла ошибка во время загрузки файла");
      }
    }

    await trx.commit();
  }

  public static async delete(id: Partner["id"]) {
    try {
      const item = await Partner.findOrFail(id);
      await item.delete();
    } catch (error: any) {
      throw new Error("Произошла ошибка во время удаления");
    }
  }

  public static async uploadImage(id: number, image: MultipartFileContract) {
    const fileName = `${id}_${image.clientName}`;
    try {
      await image.moveToDisk(PARTNERS_FOLDER_PATH, { name: fileName });
      return `${PARTNERS_FOLDER_PATH}/${fileName}`;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
