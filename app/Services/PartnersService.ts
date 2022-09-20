import Partner from "App/Models/Partner";
import { ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";
import { PaginationConfig } from "Contracts/database";
import PartnerWithVideoValidator from "./../Validators/partnersValidators/PartnerWithVideoValidator";
import PartnerWithImageValidator from "./../Validators/partnersValidators/PartnerWithImageValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import type { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { PARTNERS_FOLDER_PATH } from "Config/drive";
import Drive from "@ioc:Adonis/Core/Drive";
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response';
import { Err } from 'Contracts/response';

export default class PartnersService {
  public static async paginatePartners(
    paginationConfig: PaginationConfig
  ): Promise<ModelPaginatorContract<Partner>> {
    paginationConfig.page = paginationConfig.page ?? 1;
    paginationConfig.limit = paginationConfig.limit ?? 9;
    paginationConfig.baseUrl = "/partners";

    try {
      return await Partner.query().getViaPaginate(paginationConfig);
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Partner["id"]) {
    try {
      return await Partner.findOrFail(id);
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err
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
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
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
    } catch (err: any) {
      Logger.error(err)
      await trx.rollback();
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (payload.media) {
      try {
        const filePath = await this.uploadImage(partner.id, payload.media);
        await partner.merge({ media: filePath }).save();
      } catch (error) {
        await trx.rollback();
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    await trx.commit();
  }

  public static async editWithImage(
    id: Partner["id"],
    payload: PartnerWithImageValidator["schema"]["props"]
  ) {
    let partner: Partner;
    const trx = await Database.transaction();

    try {
      partner = await Partner.findOrFail(id, { client: trx });
      await partner
        .merge({
          ...payload,
          mediaType: Number(payload.mediaType),
          media: partner.media,
          formattedVideoLink: null,
        })
        .save();
      } catch (err: any) {
      Logger.error(err)
      await trx.rollback();
      
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (payload.media) {
      if (partner.media) {
        await Drive.delete(partner.media);
      }

      try {
        const filePath = await this.uploadImage(id, payload.media);
        await partner.merge({ media: filePath }).save();
      } catch (err: any) {
        Logger.error(err)
        trx.rollback();
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    await trx.commit();
  }

  public static async editWithVideo(
    id: Partner["id"],
    payload: PartnerWithVideoValidator["schema"]["props"]
  ) {
    let partner: Partner;

    try {
      partner = await Partner.findOrFail(id);

      if (partner.media && partner.mediaType === 0) {
        await Drive.delete(partner.media);
      }

      await partner
        .merge({ ...payload, mediaType: Number(payload.mediaType) })
        .save();
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
  }

  public static async delete(id: Partner["id"]) {
    try {
      const item = await Partner.findOrFail(id);
      await item.delete();
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
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
