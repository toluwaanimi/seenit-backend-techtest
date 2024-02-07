import {
  IPaginateOptions,
  IPaginateResult,
  IFindOneOptions,
  IFindOptions,
} from '../adapters';

/**
 * Base Repository Interface
 * @description Base Repository Interface
 * @interface
 * @name IBaseRepository
 * @type
 * @typeparam T - Entity
 * @property {function} save - Save entity
 * @property {function} find - Find entity
 * @property {function} findOne - Find one entity
 * @property {function} paginate - Paginate entity
 * @property {function} delete - Delete entity
 * @property {function} update - Update entity
 * @returns {Promise}
 */
export interface IBaseRepository<T> {
  save?(entity: Partial<T>): Promise<T>;

  find?(options: IFindOptions<T>): Promise<T[]>;

  findOne?(query: IFindOneOptions<T>): Promise<T | null>;

  paginate?(
    option: IPaginateOptions,
    searchOptions?: IFindOptions<T>,
  ): Promise<IPaginateResult<T>>;

  delete?(id: string): Promise<string>;

  update?(id: string, entity: Partial<T>): Promise<T>;
}
