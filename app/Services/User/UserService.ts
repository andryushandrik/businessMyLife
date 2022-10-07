// * Types
import type BlockUntilValidator from 'App/Validators/BlockUntilValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import User from 'App/Models/User/User'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { RoleNames } from 'Config/user'

export default class UserService {
  public static async paginate(config: PaginateConfig<User>): Promise<ModelPaginatorContract<User>> {
    try {
      return await User.query().getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateAdminsAndModerators(config: PaginateConfig<User>): Promise<ModelPaginatorContract<User>> {
    const roleTypes: RoleNames[] = [RoleNames.ADMIN, RoleNames.MODERATOR]

    try {
      return await User
        .query()
        .withScopes((scopes) => scopes.getByRoleIds(roleTypes))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: User['id'], config?: ServiceConfig<User>): Promise<User>
  public static async get(email: User['email'], config?: ServiceConfig<User>): Promise<User>
  public static async get(idOrEmail: User['id'] | User['email'], { relations }: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      if (typeof idOrEmail === 'number')
        item = await User.find(idOrEmail)
      else
        item = await User.findBy('email', idOrEmail)
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

  public static async delete(id: User['id']): Promise<void> {
    let item: User

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

  public static async blockUntil(id: User['id'], payload: BlockUntilValidator['schema']['props']): Promise<void> {
    let item: User

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
}
