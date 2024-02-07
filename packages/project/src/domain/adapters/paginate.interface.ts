export interface IPaginateOptions {
  page: number;
  limit: number;
  sort?: string;
}

export interface IPaginateResult<T> {
  data: T[];
  limit: number;
  itemCount: number;
  itemsPerPage: number;
  currentPage: number;
}
