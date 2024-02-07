export interface IFindOptions<T> {
  where?: Partial<T>;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

export interface IFindOneOptions<T> {
  where: Partial<T>;
}
