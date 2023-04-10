// * Types
import type { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import type { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'
// * Types

declare module '@ioc:Adonis/Lucid/Orm' {
	interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
		getViaPaginate(config: PaginationConfig): Promise<Result extends LucidRow ? ModelPaginatorContract<Result> : SimplePaginatorContract<Result>>
		random(): ModelQueryBuilderContract<Model>
	}
}

export type PaginationConfig = {
	page: number
	baseUrl?: string
	limit?: number
	queryString?: Record<string, any>
	orderByColumn?: string
	orderBy?: 'asc' | 'desc'
}

export type JSONPaginate = {
	meta: any
	data: ModelObject[]
}
