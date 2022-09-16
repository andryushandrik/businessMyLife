// * Types
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
