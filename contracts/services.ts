// * Types
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import type { ExtractModelRelations, LucidRow } from '@ioc:Adonis/Lucid/Orm'
// * Types

export type PaginateConfig<M extends LucidRow> = {
  page: number,
  baseUrl?: string,
  limit?: number,
  orderBy?: 'asc' | 'desc',
  orderByColumn?: string,
  relations?: ExtractModelRelations<M>[],
}

export type ServiceConfig<M extends LucidRow> = {
  trx?: TransactionClientContract,
  relations?: ExtractModelRelations<M>[],
  aggregates?: ExtractModelRelations<M>[],
}
