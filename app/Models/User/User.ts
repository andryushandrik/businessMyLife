import Advertisement from 'App/Models/Advertisement'
// * Types
import type { DateTime } from 'luxon'
import type { Err } from 'Contracts/response'
import type { UserExperienceTypes } from 'Config/user'
import type { HasMany, ManyToMany, ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Friend from './Friend'
import Role from '../User/Role'
import Offer from '../Offer/Offer'
import UserImage from './UserImage'
import Report from '../Report/Report'
import Hash from '@ioc:Adonis/Core/Hash'
import Logger from '@ioc:Adonis/Core/Logger'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { RoleNames, UserTypeNames } from 'Config/user'
import { ResponseCodes, ResponseMessages } from 'Config/response'
import { getModelsManyToManyRelationsOptions } from 'Helpers/index'
import { ROLE_NAMES, USER_EXPERIENCE_TYPES, USER_TYPE_NAMES } from 'Config/user'
import { BaseModel, beforeSave, column, computed, hasMany, scope, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
	public static readonly columns = [
		'id',
		'isShowEmail',
		'isShowPhone',
		'type',
		'firstName',
		'lastName',
		'patronymic',
		'email',
		'password',
		'taxpayerIdentificationNumber',
		'mainStateRegistrationNumber',
		'legalAddress',
		'placeOfWork',
		'companyName',
		'experienceType',
		'birthday',
		'city',
		'phone',
		'balance',
		'avatar',
		'hobby',
		'roleId',
		'createdAt',
		'updatedAt',
		'blockedUntil',
		'blockDescription',
	] as const

	@column({ isPrimary: true })
	public id: number

	@column()
	public isShowEmail: boolean

	@column()
	public isShowPhone: boolean

	@column()
	public type: UserTypeNames

	@column()
	public firstName: string

	@column()
	public lastName: string

	@column()
	public email: string

	@column()
	public balance: number

	@column({ serializeAs: null })
	public password: string

	@column()
	public patronymic?: string

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

	/**
	 * * Timestamps
	 */

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@column.dateTime()
	public blockedUntil?: DateTime | null

	@column({ columnName: 'blockDescription' })
	public blockDescription?: string | null
	/**
	 * * Aggregates columns
	 */

	@column({ columnName: 'reports_count' })
	public reportsCount?: number

	@column({ columnName: 'favoriteOffers_count' })
	public favoriteOffersCount?: number

	/**
	 * * Relations
	 */

	@hasMany(() => UserImage)
	public images: HasMany<typeof UserImage>

	@hasMany(() => Offer)
	public offers: HasMany<typeof Offer>

	@hasMany(() => Report)
	public reports: HasMany<typeof Report>

	@hasMany(() => Advertisement)
	public ads: HasMany<typeof Advertisement>

	@hasMany(() => Report, { foreignKey: 'toId' })
	public reportsTo: HasMany<typeof Report>

	@hasMany(() => Advertisement)
	public advertisements: HasMany<typeof Advertisement>

	@manyToMany(() => Offer, getModelsManyToManyRelationsOptions('FAVORITE_OFFERS'))
	public favoriteOffers: ManyToMany<typeof Offer>

	@manyToMany(() => User, {
		...getModelsManyToManyRelationsOptions('FRIENDS', 'to_id', 'from_id'),
		onQuery(query) {
			query.where('isRequest', false)
		},
	})
	public friends: ManyToMany<typeof User>

	@manyToMany(() => User, {
		...getModelsManyToManyRelationsOptions('FRIENDS', 'to_id', 'from_id'),
		onQuery(query) {
			query.where('isRequest', true)
		},
	})
	public incomings: ManyToMany<typeof User>

	@manyToMany(() => User, {
		...getModelsManyToManyRelationsOptions('FRIENDS', 'from_id', 'to_id'),
		onQuery(query) {
			query.where('isRequest', true)
		},
	})
	public outgoings: ManyToMany<typeof User>

	/**
	 * * Computed properties
	 */

	@computed()
	public get fullName(): string {
		return `${this.firstName} ${this.lastName}`
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
		if (this.birthday) return this.birthday.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
		return ''
	}

	@computed()
	public get roleForUser(): string {
		return ROLE_NAMES[this.roleId - 1]
	}

	@computed()
	public get typeForUser(): string {
		return USER_TYPE_NAMES[this.type]
	}

	@computed()
	public get isFormCompleted(): boolean {
		if (this.type === 0) {
			// PHYSICAL_PERSON
			return Boolean(this.firstName && this.lastName && this.email && this.phone && this.city)
		}
		if (this.type === 1) {
			//INDIVIDUAL_ENTREPRENEUR
			return Boolean(
				this.companyName &&
					this.firstName &&
					this.lastName &&
					this.mainStateRegistrationNumber &&
					this.taxpayerIdentificationNumber &&
					this.email &&
					this.phone &&
					this.city,
			)
		}
		if (this.type === 2) {
			// LIMITED_LIABILITY_COMPANY
			return Boolean(
				this.companyName &&
					this.firstName &&
					this.lastName &&
					this.mainStateRegistrationNumber &&
					this.taxpayerIdentificationNumber &&
					this.email &&
					this.phone &&
					this.city,
			)
		}
		return false
	}

	/**
	 * * Query scopes
	 */

	public static getByRoleIds = scope((query: ModelQueryBuilderContract<typeof User>, roleTypes: RoleNames[]) => {
		const roleTypesToRoleIds: Role['id'][] = roleTypes.map((item) => ++item)

		query.whereIn('role_id', roleTypesToRoleIds)
	})

	public static search = scope((query, searchQuery: string) => {
		const parts: string[] = searchQuery.split(' ')

		if (parts.length == 1) {
			query.where((query) => {
				query
					.where('firstName', 'ILIKE', `%${parts[0]}%`)
					.orWhere('firstName', 'ILIKE', `%${parts[1]}%`)
					.orWhere('lastName', 'ILIKE', `%${parts[0]}%`)
					.orWhere('lastName', 'ILIKE', `%${parts[1]}%`)
					.orWhere('patronymic', 'ILIKE', `%${parts[0]}%`)
					.orWhere('patronymic', 'ILIKE', `%${parts[1]}%`)
			})
		} else {
			query.where('firstName', 'ILIKE', `%${parts[0]}%`).andWhere('lastName', 'ILIKE', `%${parts[1]}%`)
		}
	})

	/**
	 * * Hooks
	 */

	@beforeSave()
	public static async hashPassword(item: User) {
		if (item.$dirty.password) item.password = await Hash.make(item.password)
	}

	/**
	 * * Other
	 */

	public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
		const item: ModelObject = { ...this.serialize() }

		try {
			const outgoingStatus: Friend | null = await Friend.query()
				.withScopes((scopes) => scopes.getByRequest(true))
				.withScopes((scopes) => scopes.getByFromIdAndToId(currentUserId, item.id))
				.first()

			const incomingStatus: Friend | null = await Friend.query()
				.withScopes((scopes) => scopes.getByRequest(true))
				.withScopes((scopes) => scopes.getByFromIdAndToId(item.id, currentUserId))
				.first()

			const friendStatusFromCurrentUser: Friend | null = await Friend.query()
				.withScopes((scopes) => scopes.getByRequest(false))
				.withScopes((scopes) => scopes.getByFromIdAndToId(currentUserId, item.id))
				.first()

			if (!friendStatusFromCurrentUser) {
				const friendStatusToCurrentUser: Friend | null = await Friend.query()
					.withScopes((scopes) => scopes.getByRequest(false))
					.withScopes((scopes) => scopes.getByFromIdAndToId(item.id, currentUserId))
					.first()

				item.friendStatus = Boolean(friendStatusToCurrentUser)
			} else {
				item.friendStatus = Boolean(friendStatusFromCurrentUser)
			}

			item.outgoingStatus = Boolean(outgoingStatus)
			item.incomingStatus = Boolean(incomingStatus)
		} catch (err: any) {
			Logger.error(err)
			throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
		}

		return item
	}
}
