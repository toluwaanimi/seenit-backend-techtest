import { Cluster } from 'couchbase';
import { Injectable, Logger } from '@nestjs/common';
import { couchbaseConnectionConfig } from '../../config/couchbase/couchbase.config';

/**
 * Service responsible for managing the connection to the Couchbase cluster.
 * This service handles the creation and closure of connections to the Couchbase cluster,
 * as well as the retry logic for establishing the connection.
 */
@Injectable()
export class CouchBaseAdapterService {
  private cluster: Cluster;

  private readonly logger = new Logger(CouchBaseAdapterService.name);

  /**
   * Initializes the connection to the Couchbase cluster.
   * @name initializeClusterConnectionAsync
   * @returns Promise<Cluster> A promise resolving to the Couchbase cluster instance.
   */
  async initializeClusterConnectionAsync(): Promise<Cluster> {
    if (!this.cluster) {
      this.cluster = await this.connectWithRetry();
    }
    return this.cluster;
  }

  /**
   * Closes the connection to the Couchbase cluster.
   * @name closeClusterConnectionAsync
   * @returns Promise<void> A promise resolving when the connection is closed.
   */
  async closeClusterConnectionAsync(): Promise<void> {
    if (this.cluster) {
      await this.cluster.close();
      this.cluster = null;
    }
  }

  /**
   *  Establishes a connection to the Couchbase cluster with retry logic.
   *  @name connectWithRetry
   * @returns Promise<Cluster> A promise resolving to the Couchbase cluster instance.
   */
  private async connectWithRetry(): Promise<Cluster> {
    const maxRetries = 3; // Number of retries before giving up
    const retryDelay = 1000; // Delay between retries in milliseconds
    let retries = 0;

    while (retries < maxRetries) {
      try {
        this.logger.log(
          `Attempting to connect to Couchbase cluster. Attempt ${retries + 1} of ${maxRetries}`,
        );
        const cluster = await Cluster.connect(couchbaseConnectionConfig.url, {
          username: couchbaseConnectionConfig.username,
          password: couchbaseConnectionConfig.password,
          configProfile: 'wanDevelopment',
        });
        this.logger.log('Connected to Couchbase cluster successfully.');
        return cluster;
      } catch (error) {
        this.logger.error(
          `Failed to connect to Couchbase cluster: ${error.message}`,
        );
        retries++;
        if (retries < maxRetries) {
          this.logger.log(`Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    return null;
  }
}
