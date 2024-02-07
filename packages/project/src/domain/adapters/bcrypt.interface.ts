/**
 * Interface for BcryptService
 * @interface
 * @name IBcryptService
 * @property {Promise<string>} hash - Method to hash a string
 * @property {Promise<boolean>} compare - Method to compare a password with a hash
 * @returns {Promise}
 * @example
 * export class BcryptService implements IBcryptService {
 *  async hash(hashString: string): Promise<string> {
 *  return await bcrypt.hash(hashString, 10);
 *  }
 */
export interface IBcryptService {
  hash(hashString: string): Promise<string>;

  compare(password: string, hashPassword: string): Promise<boolean>;
}
