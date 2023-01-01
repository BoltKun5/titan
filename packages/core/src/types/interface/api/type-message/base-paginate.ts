export interface BasePaginate<T> {
  maxPages: number;
  currentPage: number;
  totalItems: number;
  data: T[];
}

export interface QueryPaginate {
  page?: number;
  limit?: number;
}
