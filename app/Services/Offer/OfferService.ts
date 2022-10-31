// * Types
import type User from 'App/Models/User/User'
import type Subsection from 'App/Models/Offer/Subsection'
import type OfferValidator from 'App/Validators/Offer/OfferValidator'
import type OfferFilterValidator from 'App/Validators/Offer/OfferFilterValidator'
import type OfferBlockDescriptionValidator from 'App/Validators/Offer/OfferBlockDescriptionValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import type { ModelAttributes, ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Offer from 'App/Models/Offer/Offer'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import SubsectionService from './SubsectionService'
import OfferImageService from './OfferImageService'
import { OfferCategories } from 'Config/offer'
import { OFFER_FOLDER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type OfferConfig = PaginateConfig<Offer> & {
  preloadArea?: boolean,
  withoutBanned?: boolean,
  withoutArchived?: boolean,
}

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

    if (config.aggregates) {
      for (const item of config.aggregates) {
        query = query.withCount(item)
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

      if (filter.random)
        query = query.random()

      query = this.filter(query, filter, dependencies)
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateUserOffers(userId: User['id'], config: OfferConfig, filter?: OfferFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Offer>> {
    let query: ModelQueryBuilderContract<typeof Offer> = Offer
      .query()
      .withScopes((scopes) => scopes.getByVerified(true))
      .withScopes((scopes) => scopes.getByUserId(userId))

    if (config.withoutBanned)
      query = query.withScopes((scopes) => scopes.getByBanned(false))

    if (config.withoutArchived)
      query = query.withScopes((scopes) => scopes.getByArchived(false))

    if (config.preloadArea) {
      query = query.preload('subsection', (subsection) => {
        subsection.preload('area')
      })
    }

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

  public static async get(id: Offer['id'], { relations, trx }: ServiceConfig<Offer> = {}): Promise<Offer> {
    let item: Offer | null

    try {
      item = await Offer.find(id, { client: trx })
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

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async getOffersIdsBySubSectionIds(subsectionsIds: Subsection['id'][]): Promise<Offer['id'][]> {
    try {
      const offers: { id: Offer['id'] }[] = await Offer
        .query()
        .select('id')
        .withScopes((scopes) => scopes.getBySubsectionsIds(subsectionsIds))

      return offers.map((item) => item.id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async getOffersIdsByCategory(category: OfferCategories): Promise<Offer['id'][]> {
    try {
      const offers: { id: Offer['id'] }[] = await Offer
        .query()
        .select('id')
        .withScopes((scopes) => scopes.getByCategories([category]))

      return offers.map((item) => item.id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async getOffersIdsByQuery(query: string): Promise<Offer['id'][]> {
    try {
      const offers: { id: Offer['id'] }[] = await Offer
        .query()
        .select('id')
        .withScopes((scopes) => scopes.search(query))

      return offers.map((item) => item.id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: OfferValidator['schema']['props']): Promise<void> {
    let item: Offer
    const trx: TransactionClientContract = await Database.transaction()
    const itemPayload: Partial<ModelAttributes<Offer>> = this.getOfferDataFromPayload(payload)

    try {
      item = await Offer.create(itemPayload, { client: trx })
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (payload.image) {
      let image: Offer['image']

      try {
        image = await this.uploadImage(item.id, payload.image)
      } catch (err: Err | any) {
        await trx.rollback()

        throw err
      }

      try {
        await item.merge({ image }).save()
      } catch (err: any) {
        await trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    if (payload.images) {
      try {
        await OfferImageService.createMany(item.id, payload.images, trx)
      } catch (err: Err | any) {
        await trx.rollback()

        throw err
      }
    }

    await trx.commit()
  }

  public static async update(id: Offer['id'], payload: OfferValidator['schema']['props']): Promise<void> {
    let item: Offer
    const trx: TransactionClientContract = await Database.transaction()
    const itemPayload: Partial<ModelAttributes<Offer>> = this.getOfferDataFromPayload(payload)

    try {
      item = await this.get(id, { trx })
    } catch (err: any) {
      await trx.rollback()

      throw err
    }

    try {
      await item.merge(itemPayload).save()
    } catch (err: any) {
      await trx.rollback()

      throw err
    }

    if (payload.image) {
      let image: Offer['image']

      if (item.image)
        await Drive.delete(item.image)

      try {
        image = await this.uploadImage(item.id, payload.image)
      } catch (err: Err | any) {
        await trx.rollback()

        throw err
      }

      try {
        await item.merge({ image }).save()
      } catch (err: any) {
        await trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    if (payload.images) {
      try {
        await OfferImageService.createMany(item.id, payload.images, trx)
      } catch (err: Err | any) {
        await trx.rollback()

        throw err
      }
    }

    await trx.commit()
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

  public static async delete(id: Offer['id']): Promise<void> {
    let item: Offer

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.delete()
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

  public static async verifyAll(): Promise<void> {
    try {
      await Offer.query().update({ isVerified: true })
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

          case 'category':
            query = query.withScopes((scopes) => scopes.getByCategories([payload[key]!]))

            break

          case 'investmentsFrom':
            query = query.withScopes((scopes) => scopes.getByInvestmentsFrom(payload[key]!))

            break

          case 'investmentsTo':
            query = query.withScopes((scopes) => scopes.getByInvestmentsTo(payload[key]!))

            break

          case 'projectStage':
            query = query.withScopes((scopes) => scopes.getByProjectStages([payload[key]!]))

            break

          case 'paybackTime':
            query = query.withScopes((scopes) => scopes.getByPaybackTimes([payload[key]!]))

            break

          case 'city':
            query = query.withScopes((scopes) => scopes.getByCity(payload[key]!))

            break

          case 'areaId':
            if (dependencies?.subsectionsIds)
              query = query.withScopes((scopes) => scopes.getBySubsectionsIds(dependencies.subsectionsIds))

            break

          case 'subsectionId':
            query = query.withScopes((scopes) => scopes.getBySubsectionsIds([payload[key]!]))

            break

          default:
            break
        }

      }
    }

    return query
  }

  private static async uploadImage(id: Offer['id'], image: MultipartFileContract): Promise<string> {
    const path: string = `${OFFER_FOLDER_PATH}/${id}`

    try {
      await image.moveToDisk(path)
      return `${path}/${image.fileName}`
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  private static getOfferDataFromPayload(payload: OfferValidator['schema']['props']): Partial<ModelAttributes<Offer>> {
    return {
      title: payload.title,
      description: payload.description,
      city: payload.city,

      category: payload.category,

      cooperationTerms: payload.cooperationTerms,
      businessPlan: payload.businessPlan,
      benefits: payload.benefits,

      about: payload.about,
      aboutCompany: payload.aboutCompany,

      projectStage: payload.projectStage,
      paybackTime: payload.paybackTime,

      investments: payload.investments,
      dateOfCreation: payload.dateOfCreation,

      profit: payload.profit,
      profitPerMonth: payload.profitPerMonth,

      branchCount: payload.branchCount,
      soldBranchCount: payload.soldBranchCount,

      price: payload.price,
      pricePerMonth: payload.pricePerMonth,

      userId: payload.userId,
      subsectionId: payload.subsectionId,
    }
  }
}
