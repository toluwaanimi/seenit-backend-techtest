export type ComparisonOperator =
  | '='
  | '!='
  | 'IN'
  | 'NOT IN'
  | '>'
  | '<'
  | '>='
  | '<='
  | 'STARTS WITH'
  | 'ENDS WITH'
  | 'CONTAINS'
  | 'IS NULL'
  | 'IS NOT NULL';

export type Condition<T> = {
  [K in keyof T]?:
    | { $relational: ComparisonOperator; $value: T[K] | T[K][] }
    | any;
};

export type PartialCondition<T> =
  | Partial<Condition<T>>
  | { [K in keyof T]: T[K] | T[K][] };

export type OrderDirection = 'ASC' | 'DESC';

export interface ICouchbaseQueryBuilder<T> {
  findOne(): ICouchbaseQueryBuilder<T>;

  findAll(): ICouchbaseQueryBuilder<T>;

  select(columns: (keyof T | string)[]): ICouchbaseQueryBuilder<T>;

  from(table: string): ICouchbaseQueryBuilder<T>;

  where(
    conditions: PartialCondition<T> | PartialCondition<T>[],
  ): ICouchbaseQueryBuilder<T>;

  andWhere(conditions: PartialCondition<T>): ICouchbaseQueryBuilder<T>;

  orWhere(conditions: PartialCondition<T>[]): ICouchbaseQueryBuilder<T>;

  orderBy(
    field: keyof T,
    direction?: OrderDirection,
  ): ICouchbaseQueryBuilder<T>;

  limit(limit: number): ICouchbaseQueryBuilder<T>;

  offset(offset: number): ICouchbaseQueryBuilder<T>;

  update(values: Partial<T>): ICouchbaseQueryBuilder<T>;

  delete(): ICouchbaseQueryBuilder<T>;

  build(): string;
}
