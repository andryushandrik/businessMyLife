// * Types
import type User from 'App/Models/User/User'
import type Subsection from 'App/Models/Offer/Subsection'
import type OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'
import type OfferBlockDescriptionValidator from 'App/Validators/Offer/OfferBlockDescriptionValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { ModelAttributes, ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Offer from 'App/Models/Offer/Offer'
import Logger from '@ioc:Adonis/Core/Logger'
import SubsectionService from './SubsectionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type FilterDependencies = {
  subsectionsIds: Subsection['id'][],
}

export default class OfferService {
  public static async paginate(config: PaginateConfig<Offer>, filter?: OfferFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Offer>> {
    let query: ModelQueryBuilderContract<typeof Offer> = Offer
      .query()
      .withScopes((scopes) => scopes.getByVerified(true))

    if (config.relations) {
      for (const item of config.relations) {
        query = query.preload(item)
      }
    }

    if (filter) {
      let dependencies: FilterDependencies | undefined = undefined

      if (filter.areaId) {
        try {
          const subsectionsIds: Subsection['id'][] = await SubsectionService.getSubsectionsIdsByAreaId(filter.areaId)

          dependencies = { subsectionsIds }
        } catch (err: Err | any) {
          throw err
        }
      }

      query = this.filter(query, filter, dependencies)
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateUserOffers(userId: User['id'], config: PaginateConfig<Offer>, filter?: OfferFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Offer>> {
    let query: ModelQueryBuilderContract<typeof Offer> = Offer
      .query()
      .withScopes((scopes) => scopes.getByVerified(true))
      .withScopes((scopes) => scopes.getByUserId(userId))

    if (config.relations) {
      for (const item of config.relations) {
        query = query.preload(item)
      }
    }

    if (filter) {
      let dependencies: FilterDependencies | undefined = undefined

      if (filter.areaId) {
        try {
          const subsectionsIds: Subsection['id'][] = await SubsectionService.getSubsectionsIdsByAreaId(filter.areaId)

          dependencies = { subsectionsIds }
        } catch (err: Err | any) {
          throw err
        }
      }

      query = this.filter(query, filter, dependencies)
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateNotVerifiedOffers(config: PaginateConfig<Offer>, filter?: OfferFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Offer>> {
    let query: ModelQueryBuilderContract<typeof Offer> = Offer
      .query()
      .withScopes((scopes) => scopes.getByVerified(false))

    if (config.relations) {
      for (const item of config.relations) {
        query = query.preload(item)
      }
    }

    if (filter) {
      let dependencies: FilterDependencies | undefined = undefined

      if (filter.areaId) {
        try {
          const subsectionsIds: Subsection['id'][] = await SubsectionService.getSubsectionsIdsByAreaId(filter.areaId)

          dependencies = { subsectionsIds }
        } catch (err: Err | any) {
          throw err
        }
      }

      query = this.filter(query, filter, dependencies)
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Offer['id'], { relations }: ServiceConfig<Offer> = {}): Promise<Offer> {
    let item: Offer | null

    try {
      item = await Offer.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    try {
      if (relations) {
        for (const relation of relations) {
          await item.load(relation)
        }
      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    return item
  }

  public static async updateBlockDescription(id: Offer['id'], payload: OfferBlockDescriptionValidator['schema']['props']): Promise<void> {
    let item: Offer

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async actions(id: Offer['id'], actionType: 'archive' | 'ban' | 'verify', actionValue: boolean): Promise<void> {
    let item: Offer
    const offerData: Partial<ModelAttributes<Offer>> = {}

    switch (actionType) {
      case 'archive':
        offerData.isArchived = actionValue
        break

      case 'ban':
        offerData.isBanned = actionValue
        break

      case 'verify':
        offerData.isVerified = actionValue
        break

      default:
        break
    }

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge(offerData).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static filter(query: ModelQueryBuilderContract<typeof Offer>, payload: OfferFilterValidator['schema']['props'], dependencies?: FilterDependencies): ModelQueryBuilderContract<typeof Offer> {
    for (const key in payload) {
      if (payload[key]) {

        switch (key) {
          // Skip this api's keys
          case 'page':
          case 'limit':
          case 'orderBy':
          case 'orderByColumn':
            break
          // Skip this api's keys

          case 'query':
            query = query.withScopes((scopes) => scopes.search(payload[key]!))

            break

          case 'areaId':
            if (dependencies?.subsectionsIds)
              query = query.withScopes((scopes) => scopes.getBySubsectionsIds(dependencies.subsectionsIds))

            break

          default:
            break
        }

      }
    }

    return query
  }
}
