export interface ResponsePagination<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
