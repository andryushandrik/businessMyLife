import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Banner from 'App/Models/Banner'
import BannerValidator from 'App/Validators/BannerValidator'
import { PaginationConfig } from 'Contracts/database'
import { BANNERS_FOLDER_PATH } from '../../config/drive'
import type { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import Database from '@ioc:Adonis/Lucid/Database'
import Drive from "@ioc:Adonis/Core/Drive"


export default class BannerService{
    public static async paginateBanners(paginationConfig: PaginationConfig): Promise<ModelPaginatorContract<Banner>>{
        paginationConfig.baseUrl = "/banners";
        paginationConfig.limit = 9;
        
        try {
            const bannerItems = await Banner.query().getViaPaginate(paginationConfig)
            return bannerItems    
        } catch (error) {
            throw new Error("Не удалось получить данные")
        }
    }

    public static async get(id: number){
        try {
          const item =  await Banner.find(id)
          if(!item) throw new Error("Баннер не найден")
    
          return item
        } catch (error) {
          throw new Error(error)
        }
      }

    public static async create(payload: BannerValidator["schema"]["props"]){
        let banner: Banner
        const trx = await Database.transaction()

        try {
            banner = await Banner.create({ ...payload, image: undefined }, {client: trx})
        } catch (error) {
            console.log("dsfdsf", error.message)
            await trx.rollback()
            throw new Error('Произошла ошибка во время создания баннера')
        }

        if(payload.image){
            try {
                const filePath = await this.uploadImage(banner.id, payload.image)
                await banner.merge({image: filePath}).save()
            } catch (error) {
                await trx.rollback()
                throw new Error('Произошла ошибка во время загрузки файла')
            }
        }

        await trx.commit()
    }

    public static async edit(id:number, payload: BannerValidator["schema"]["props"]){
        let banner: Banner
        const trx = await Database.transaction()
    
        try {
          banner = await Banner.findOrFail(id, {client: trx})
          await banner.merge({...payload, image: banner.image}).save()
        } catch (error) {
          trx.rollback()
          throw new Error(error)
        }
    
        if(payload.image){
          if(banner.image){
            await Drive.delete(banner.image)
          }
    
          try {
            const uploadedFilePath = await this.uploadImage(banner.id, payload.image)
            await banner.merge({image: uploadedFilePath}).save()
          } catch (error) {
            trx.rollback()
            throw new Error("Произошла ошибка во время загрузки файла")
          }
        }
    
        trx.commit()
      }

    public static async delete(id: Banner["id"]){
        try {
            const item = await Banner.findOrFail(id)
            await item.delete()
        } catch (error: any) {
            throw new Error('Произошла ошибка во время удаления')
        }
    }

    public static async uploadImage(id: number, image: MultipartFileContract) {
        const fileName = `${id}_${image.clientName}`
        try {
          await image.moveToDisk(BANNERS_FOLDER_PATH, {name: fileName})
          return `${BANNERS_FOLDER_PATH}/${fileName}`
        } catch (error) {
          throw new Error(error.message);
        }
      }
}