// * Types
import type Conversation from 'App/Models/Chat/Conversation'
// * Types

import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { TABLES_NAMES } from 'Config/database'
import { string as helperString } from '@ioc:Adonis/Core/Helpers'
import { LucidModel, ManyToMany, ManyToManyRelationOptions } from '@ioc:Adonis/Lucid/Orm'

export function formatStringForCyrillic(val: string, style: 'camelCase' | 'snakeCase', replacement?: string): string {
	val = cyrillicToTranslit().transform(val, replacement)

	return helperString[style](val)
}

export function getRandom(min: number, max: number): number {
	min = Math.ceil(min)
	max = Math.floor(max)

	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getToken(header: string): string {
	return header.split(' ')[1]
}

export function getModelsManyToManyRelationsOptions<M extends LucidModel>(
	table?: keyof typeof TABLES_NAMES,
	foreignKey?: string,
	relatedForeignKey?: string,
): ManyToManyRelationOptions<ManyToMany<M>> {
	const pivotTable: string | undefined = table ? TABLES_NAMES[table] : undefined

	return {
		pivotTable,
		pivotForeignKey: foreignKey,
		pivotRelatedForeignKey: relatedForeignKey,
		pivotTimestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
	}
}

export function getConversationRoomName(id: Conversation['id']): string {
	return `conversationRoom-${id}`
}
