// * Types
import type { BelongsTo, HasMany } from '@ioc:Adonis/Lucid/Orm'
// * Types

import User from '../User/User'
import Subsection from './Subsection'
import OfferImage from './OfferImage'
import Drive from '@ioc:Adonis/Core/Drive'
import { DateTime } from 'luxon'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { formatStringForCyrillic } from 'Helpers/index'
import { OFFER_CATEGORIES, OFFER_PAYBACK_TIMES, OFFER_PROJECT_STAGES } from 'Config/offer'
import {
  BaseModel, beforeDelete, beforeSave,
  belongsTo, column, computed,
  hasMany, scope,
} from '@ioc:Adonis/Lucid/Orm'

export default class Offer extends BaseModel {
  public static readonly columns = [
    'id', 'isBanned', 'isArchived', 'isVerified', 'viewsCount',
    'slug', 'title', 'description', 'city', 'image',
    'category', 'paybackTime',
    'cooperationTerms', 'businessPlan', 'benefits',
    'about', 'aboutCompany',
    'investments', 'projectStage', 'dateOfrCreation',
    'price', 'pricePerMonth',
    'profitPerMonth', 'profit',
    'branchCount', 'soldBranchCount',
    'blockDescription',
    'userId', 'subsectionId',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isBanned: boolean

  @column()
  public isArchived: boolean

  @column()
  public isVerified: boolean

  @column()
  public viewsCount: number

  @column()
  public slug: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public city: string

  @column()
  public category: number

  @column()
  public paybackTime: number

  @column()
  public image?: string

  @column()
  public cooperationTerms?: string

  @column()
  public businessPlan?: string

  @column()
  public benefits?: string

  @column()
  public about?: string

  @column()
  public aboutCompany?: string

  @column()
  public investments?: number

  @column()
  public projectStage?: number

  @column.date()
  public dateOfCreation?: DateTime

  @column()
  public price?: number

  @column()
  public pricePerMonth?: number

  @column()
  public profitPerMonth?: number

  @column()
  public profit?: number

  @column()
  public branchCount?: number

  @column()
  public soldBranchCount?: number

  @column()
  public blockDescription?: string | null

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'subsection_id' })
  public subsectionId: Subsection['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Relations
   */

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Subsection)
  public subsection: BelongsTo<typeof Subsection>

  @hasMany(() => OfferImage)
  public images: HasMany<typeof OfferImage>

  /**
   * * Computed properties
   */

  @computed()
  public get isArchivedForUser(): string {
    return this.isArchived ? 'Да' : 'Нет'
  }

  @computed()
  public get isBannedForUser(): string {
    return this.isBanned ? 'Да' : 'Нет'
  }

  @computed()
  public get isVerifiedForUser(): string {
    return this.isVerified ? 'Да' : 'Нет'
  }

  @computed()
  public get categoryForUser(): string {
    return OFFER_CATEGORIES[this.category]
  }

  @computed()
  public get paybackTimeForUser(): string {
    return OFFER_PAYBACK_TIMES[this.paybackTime]
  }

  @computed()
  public get projectStageForUser(): string {
    return this.projectStage ? OFFER_PROJECT_STAGES[this.projectStage] : ''
  }

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
  }

  @computed()
  public get archiveExpire(): string {
    const expireDate: DateTime = this.updatedAt.plus({ months: 1 })
    const archiveExpireInDays: number = expireDate.diff(DateTime.now(), 'days').days
    const archiveExpireInDaysWithoutFraction: number = Math.floor(archiveExpireInDays)

    return `${archiveExpireInDaysWithoutFraction} дней`
  }

  /**
   * * Query scopes
   */

  public static getByArchived = scope((query, isArchived: Offer['isArchived']) => [
    query.where('isArchived', isArchived)
  ])

  public static getByVerified = scope((query, isVerified: Offer['isVerified']) => [
    query.where('isVerified', isVerified)
  ])

  public static getByUserId = scope((query, userId: User['id']) => [
    query.where('user_id', userId)
  ])

  public static getBySubsectionsIds = scope((query, subsectionsIds: Subsection['id'][]) => {
    query.whereIn('subsection_id', subsectionsIds)
  })

  public static search = scope((query, searchQuery: string) => {
    query.where('title', 'ILIKE', `%${searchQuery}%`)
  })

  /**
   * * Hooks
   */

  @beforeSave()
  public static formatSlug(item: Offer) {
    if (item.$dirty.slug)
      item.slug = formatStringForCyrillic(item.slug, 'snakeCase', '_')

    if (!item.slug)
      item.slug = formatStringForCyrillic(item.title, 'snakeCase', '_')
  }

  @beforeDelete()
  public static async deleteStoredImage(item: Offer) {
    if (item.image)
      await Drive.delete(item.image)
  }
}
