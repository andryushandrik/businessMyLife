import { ModelObject } from '@ioc:Adonis/Lucid/Orm'

export type serializedModel = {
	meta: any
	data: ModelObject[]
}
