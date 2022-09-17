// * Types
import type Role from '../User/Role'
import type UserType from './UserType'
import type { DateTime } from 'luxon'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
import type { UserExperienceTypes } from 'Config/user'
// * Types

import UserImage from './UserImage'
import Hash from '@ioc:Adonis/Core/Hash'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { BaseModel, beforeSave, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { ROLE_NAMES, USER_EXPERIENCE_TYPES, USER_TYPE_NAMES } from 'Config/user'

export default class User extends BaseModel {
  public static readonly columns = [
    'id', 'isShowEmail', 'isShowPhone',
    'firstName', 'lastName', 'patronymic',
    'email', 'password',
    'taxpayerIdentificationNumber', 'mainStateRegistrationNumber',
    'legalAddress', 'placeOfWork', 'companyName', 'experienceType',
    'birthday', 'city', 'phone', 'avatar', 'hobby',
    'roleId', 'typeId',
    'createdAt', 'updatedAt', 'blockedUntil',
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public isShowEmail: boolean

  @column()
  public isShowPhone: boolean

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public patronymic: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public taxpayerIdentificationNumber?: number

  @column()
  public mainStateRegistrationNumber?: number

  @column()
  public legalAddress?: string

  @column()
  public placeOfWork?: string

  @column()
  public companyName?: string

  @column()
  public experienceType?: UserExperienceTypes

  @column.date()
  public birthday?: DateTime

  @column()
  public city?: string

  @column()
  public phone?: string

  @column()
  public avatar?: string

  @column()
  public hobby?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'role_id' })
  public roleId: Role['id']

  @column({ columnName: 'type_id' })
  public typeId: UserType['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public blockedUntil?: DateTime

  /**
   * * Computed properties
   */

  @computed()
  public get fullName(): string {
    return `${this.lastName} ${this.firstName}`
  }

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
  }

  @computed()
  public get blockedUntilForUser(): string {
    return this.blockedUntil ? this.blockedUntil.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT) : ''
  }

  @computed()
  public get experienceTypeForUser(): string {
    return this.experienceType ? USER_EXPERIENCE_TYPES[this.experienceType] : 'Нет опыта'
  }

  @computed()
  public get birthdayForUser(): string {
    if (this.birthday)
      return this.birthday.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)

    return ''
  }

  @computed()
  public get roleForUser(): string {
    return ROLE_NAMES[this.roleId - 1]
  }

  @computed()
  public get typeForUser(): string {
    return USER_TYPE_NAMES[this.typeId - 1]
  }

  /**
   * * Relations
   */

  @hasMany(() => UserImage)
  public images: HasMany<typeof UserImage>

  /**
   * * Hooks
   */

  @beforeSave()
  public static async hashPassword(item: User) {
    if (item.$dirty.password)
      item.password = await Hash.make(item.password)
  }
}
