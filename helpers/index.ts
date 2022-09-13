import { LucidRow, ModelPaginatorContract } from "@ioc:Adonis/Lucid/Orm";

export const getPaginationState = (modelPaginator: ModelPaginatorContract<LucidRow>) => {
    const currentPage = modelPaginator.currentPage

    const startNum = (currentPage - 1) * modelPaginator.perPage + 1
    const endNum =  startNum - 1 + modelPaginator.perPage
    const displayPages = `Показаны записи ${startNum} - ${endNum <= modelPaginator.total ? endNum : modelPaginator.total} из ${modelPaginator.total}`
    const paginationLinks = modelPaginator.getUrlsForRange(1, modelPaginator.lastPage)
    const hasMorePages = modelPaginator.hasMorePages
    const nextPageUrl = modelPaginator.getUrl(currentPage + 1)
    const previousPageUrl = modelPaginator.getUrl(currentPage - 1)

    const state = {startNum, endNum, displayPages, paginationLinks, hasMorePages, nextPageUrl, previousPageUrl}

  return state
};
