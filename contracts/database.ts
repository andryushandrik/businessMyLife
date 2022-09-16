// * Types
import type { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'
// * Types

declare module '@ioc:Adonis/Lucid/Orm' {
  interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>
  > {
    getViaPaginate(config: PaginationConfig): Promise<Result extends LucidRow ? ModelPaginatorContract<Result> : SimplePaginatorContract<Result>>,
  }
}

export type PaginationConfig = {
  page: number,
  baseUrl?: string,
  limit?: number,
  orderByColumn?: string,
  orderBy?: 'asc' | 'desc',
}
