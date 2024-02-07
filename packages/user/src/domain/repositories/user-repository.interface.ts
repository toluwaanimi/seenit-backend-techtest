import { UserModel } from '../model';
import { IBaseRepository } from '../abstract';

/**
 * User repository interface
 * @interface IUserRepository  - User repository interface
 * @extends {IBaseRepository<UserModel>} - Extends IBaseRepository<UserModel> interface from abstract folder
 */
export interface IUserRepository extends IBaseRepository<UserModel> {
  getUserByEmail(email: string): Promise<UserModel | null>;
}
