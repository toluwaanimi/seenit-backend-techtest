/**
 * Interface for the Couchbase configuration
 * @interface ICouchbaseConfig
 * @export
 * @interface ICouchbaseConfig
 * @property {string} url The URL of the Couchbase server
 * @property {string} username The username to connect to the Couchbase server
 * @property {string} password The password to connect to the Couchbase server
 * @property {string} bucket The bucket to connect to
 * @property {string} scope The scope to connect to
 * @example
 * ```ts
 * const config: ICouchbaseConfig = {
 *  url: 'couchbase://localhost',
 *  username: 'admin',
 *  password: 'password',
 *  bucket: 'default',
 *  scope: 'default',
 *  };
 *  ```
 *
 */
export interface ICouchbaseConfig {
  url: string;
  username: string;
  password: string;
  bucket: string;
  scope: string;
}
