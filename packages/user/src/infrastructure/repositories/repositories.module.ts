import { Global, Module } from '@nestjs/common';
import { CouchBaseAdapterService } from './database';
import { UserRepository } from './user.repository';
import { Cluster } from 'couchbase';

@Global()
@Module({
  providers: [
    CouchBaseAdapterService,
    UserRepository,
    {
      provide: 'CLUSTER',
      useFactory: async (couchBaseService: CouchBaseAdapterService) => {
        return await couchBaseService.initializeClusterConnectionAsync();
      },
      inject: [CouchBaseAdapterService],
    },
    {
      provide: Cluster,
      useExisting: 'CLUSTER',
    },
  ],
  exports: ['CLUSTER', UserRepository],
})
export class RepositoriesModule {}
