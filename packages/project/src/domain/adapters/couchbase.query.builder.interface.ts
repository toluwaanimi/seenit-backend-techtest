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

/**
 * @name Condition
 * @param T - Type of the model
 * @returns { [K in keyof T]?: { $relational: ComparisonOperator; $value: T[K] | T[K][] } | any }
 */
export type Condition<T> = {
  [K in keyof T]?:
    | { $relational: ComparisonOperator; $value: T[K] | T[K][] }
    | any;
};

/**
 * @name PartialCondition
 * @param T - Type of the model
 * @returns Partial<Condition<T>> | { [K in keyof T]: T[K] | T[K][] }
 */
export type PartialCondition<T> =
  | Partial<Condition<T>>
  | { [K in keyof T]: T[K] | T[K][] };

/**
 * @name OrderDirection
 * @type OrderDirection
 * @description Order direction
 */
export type OrderDirection = 'ASC' | 'DESC';

/**
 * Interface for Couchbase Query Builder
 * @param T - Type of the model
 * @returns ICouchbaseQueryBuilder
 */
export interface ICouchbaseQueryBuilder<T> {
  /**
   * @name findOne
   */
  findOne(): ICouchbaseQueryBuilder<T>;

  /**
   * @name findAll
   */
  findAll(): ICouchbaseQueryBuilder<T>;

  /**
   * @name select
   * @param columns
   */
  select(columns: (keyof T | string)[]): ICouchbaseQueryBuilder<T>;

  /**
   * @name from
   * @description Set the collection to query
   * @param table
   */
  from(table: string): ICouchbaseQueryBuilder<T>;

  /**
   * @name where
   * @param conditions
   * @description Set the conditions to query
   */
  where(
    conditions: PartialCondition<T> | PartialCondition<T>[],
  ): ICouchbaseQueryBuilder<T>;

  /**
   * @name andWhere
   * @param conditions
   * @description Set the conditions to query with AND
   */
  andWhere(conditions: PartialCondition<T>): ICouchbaseQueryBuilder<T>;

  /**
   * @name orWhere
   * @param conditions
   * @description Set the conditions to query with OR
   */
  orWhere(conditions: PartialCondition<T>[]): ICouchbaseQueryBuilder<T>;

  /**
   * @name orderBy
   * @param field
   * @param direction
   * @description Set the order by field and direction
   */
  orderBy(
    field: keyof T,
    direction?: OrderDirection,
  ): ICouchbaseQueryBuilder<T>;

  /**
   * @name limit
   * @param limit
   * @description Set the limit of the query
   */
  limit(limit: number): ICouchbaseQueryBuilder<T>;

  /**
   * @name offset
   * @param offset
   * @description Set the offset of the query
   */
  offset(offset: number): ICouchbaseQueryBuilder<T>;

  /**
   * @name insert
   * @param values
   * @description Set the values to insert
   */
  update(values: Partial<T>): ICouchbaseQueryBuilder<T>;

  /**
   * @name delete
   * @description Set the query to delete
   */
  delete(): ICouchbaseQueryBuilder<T>;

  /**
   * @name build
   * @description Build the query
   */
  build(): string;
}
