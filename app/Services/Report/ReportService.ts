// * Types
import type User from 'App/Models/User/User'
import type Offer from 'App/Models/Offer/Offer'
import type Subsection from 'App/Models/Offer/Subsection'
import type UserReportFilterValidator from 'App/Validators/Report/UserReportFilterValidator'
import type OfferReportFilterValidator from 'App/Validators/Report/OfferReportFilterValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import Report from 'App/Models/Report/Report'
import UserService from '../User/UserService'
import OfferService from '../Offer/OfferService'
import SubsectionService from '../Offer/SubsectionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type FilterDependencies = {
  usersIds: User['id'][],
  offersIds: Offer['id'][],
}

export default class ReportService {
  public static async paginateOffersReports(config: PaginateConfig<Report>, filter?: OfferReportFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Report>> {
    let query: ModelQueryBuilderContract<typeof Report> = Report
      .query()
      .withScopes((scopes) => scopes.offersReports())

    if (config.relations) {
      for (const item of config.relations) {
        query = query.preload(item)
      }
    }

    if (filter) {
      let dependencies: FilterDependencies = {
        usersIds: [],
        offersIds: [],
      }

      if (filter.query) {
        try {
          const usersIds: Offer['id'][] = await UserService.getUsersIdsByQuery(filter.query)

          dependencies.usersIds = [...dependencies.usersIds, ...usersIds]
        } catch (err: Err | any) {
          throw err
        }
      }

      if (filter.offerQuery) {
        try {
          const offersIds: Offer['id'][] = await OfferService.getOffersIdsByQuery(filter.offerQuery)

          dependencies.offersIds = [...dependencies.offersIds, ...offersIds]
        } catch (err: Err | any) {
          throw err
        }
      }

      if (filter.areaId) {
        try {
          const subsectionsIds: Subsection['id'][] = await SubsectionService.getSubsectionsIdsByAreaId(filter.areaId)
          const offersIds: Offer['id'][] = await OfferService.getOffersIdsBySubSectionIds(subsectionsIds)

          dependencies.offersIds = [...dependencies.offersIds, ...offersIds]
        } catch (err: Err | any) {
          throw err
        }
      }

      if (filter.category !== undefined && filter.category !== null) {
        try {
          const offersIds: Offer['id'][] = await OfferService.getOffersIdsByCategory(filter.category)

          dependencies.offersIds = [...dependencies.offersIds, ...offersIds]
        } catch (err: Err | any) {
          throw err
        }
      }

      query = this.offerFilter(query, filter, dependencies)
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateUsersReports(config: PaginateConfig<Report>, filter?: UserReportFilterValidator['schema']['props']): Promise<ModelPaginatorContract<Report>> {
    let query: ModelQueryBuilderContract<typeof Report> = Report
      .query()
      .withScopes((scopes) => scopes.usersReports())

    if (config.relations) {
      for (const item of config.relations) {
        query = query.preload(item)
      }
    }

    if (filter) {
      let dependencies: FilterDependencies = {
        usersIds: [],
        offersIds: [],
      }

      if (filter.query) {
        try {
          const usersIds: Offer['id'][] = await UserService.getUsersIdsByQuery(filter.query)

          dependencies.usersIds = [...dependencies.usersIds, ...usersIds]
        } catch (err: Err | any) {
          throw err
        }
      }

      query = this.userFilter(query, filter, dependencies)
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static offerFilter(query: ModelQueryBuilderContract<typeof Report>, payload: OfferReportFilterValidator['schema']['props'], dependencies: FilterDependencies): ModelQueryBuilderContract<typeof Report> {
    for (const key in payload) {
      if (payload[key] !== undefined && payload[key] !== null) {

        switch (key) {
          // Skip this api's keys
          case 'page':
          case 'limit':
          case 'orderBy':
          case 'orderByColumn':
            break
          // Skip this api's keys

          case 'query':
            if (dependencies.usersIds?.length)
              query = query.withScopes((scopes) => scopes.getByUsersIds(dependencies.usersIds!))

            break

          case 'areaId':
          case 'category':
          case 'offerQuery':
            if (dependencies.offersIds?.length)
              query = query.withScopes((scopes) => scopes.getByOffersIds(dependencies.offersIds!))

            break

          default:
            break
        }

      }
    }

    return query
  }

  private static userFilter(query: ModelQueryBuilderContract<typeof Report>, payload: UserReportFilterValidator['schema']['props'], dependencies: Pick<FilterDependencies, 'usersIds'>): ModelQueryBuilderContract<typeof Report> {
    for (const key in payload) {
      if (payload[key] !== undefined && payload[key] !== null) {

        switch (key) {
          // Skip this api's keys
          case 'page':
          case 'limit':
          case 'orderBy':
          case 'orderByColumn':
            break
          // Skip this api's keys

          case 'query':
            if (dependencies.usersIds?.length)
              query = query.withScopes((scopes) => scopes.getByUsersToIds(dependencies.usersIds!))

            break

          default:
            break
        }

      }
    }

    return query
  }
}
