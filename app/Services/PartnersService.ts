import Partner from 'App/Models/Partner'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { PaginationConfig } from 'Contracts/database'

export default class PartnersService {
    public static async paginatePartners(paginationConfig: PaginationConfig): Promise<ModelPaginatorContract<Partner>> {
        paginationConfig.page = paginationConfig.page ?? 1;
        paginationConfig.limit = 9;
        paginationConfig.baseUrl = "/partners";
        
        try {
           return await Partner.query().getViaPaginate(paginationConfig)
        } catch (error) {
            throw new Error('Произошла ошибка')
        }
    }

    
}