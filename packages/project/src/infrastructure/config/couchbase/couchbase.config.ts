import { ICouchbaseConfig } from '../../../domain/adapters';
import { envConfig } from '../environment-config/environment.config';

export const couchbaseConnectionConfig: ICouchbaseConfig = {
  url: envConfig.getDatabaseConnectionString(),
  username: envConfig.getDatabaseCluster(),
  password: envConfig.getDatabaseClusterPassword(),
  bucket: envConfig.getDatabaseBucket(),
  scope: envConfig.getDatabaseScope(),
};
