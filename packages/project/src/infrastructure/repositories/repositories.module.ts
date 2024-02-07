import { Global, Module } from '@nestjs/common';
import { CouchBaseAdapterService } from './database/couchbase.service';
import { Cluster } from 'couchbase';
import { ProjectRepository } from './project.repository';

@Global()
@Module({
  providers: [
    CouchBaseAdapterService,
    ProjectRepository,
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
  exports: ['CLUSTER', ProjectRepository],
})
export class RepositoriesModule {}
