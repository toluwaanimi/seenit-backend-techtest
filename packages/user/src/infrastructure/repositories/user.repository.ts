import { IUserRepository } from '../../domain/repositories';
import { UserModel } from '../../domain/model';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bucket, Cluster, Collection, QueryResult, Scope } from 'couchbase';
import { couchbaseConnectionConfig } from '../config/couchbase/couchbase.config';
import { v4 as uuidv4 } from 'uuid';
import {
  IFindOneOptions,
  IFindOptions,
  IPaginateOptions,
  IPaginateResult,
} from '../../domain/adapters';
import { getErrorMessage, ILike } from './database';
import { CouchbaseQueryBuilder } from './database/couchbase.query.builder';

/**
 * UserRepository responsible for managing user data in the Couchbase database.
 * This repository handles CRUD operations for user data.
 * @implements IUserRepository
 */
@Injectable()
export class UserRepository implements IUserRepository, OnModuleInit {
  private collection: Collection;
  private scope: Scope;
  private bucket: Bucket;
  private collectionName = 'users';
  private isInitialized = false;

  constructor(private readonly cluster: Cluster) {}

  async onModuleInit(): Promise<void> {
    /**
     * Initialize the connection to the Couchbase cluster.
     */
    if (!this.isInitialized && this.cluster) {
      this.bucket = this.cluster.bucket(couchbaseConnectionConfig.bucket);
      this.scope = this.bucket.scope(couchbaseConnectionConfig.scope);
      this.collection = this.cluster
        .bucket(couchbaseConnectionConfig.bucket)
        .scope(couchbaseConnectionConfig.scope)
        .collection(this.collectionName);
      this.isInitialized = true;
    }
  }

  /**
   * Get a user by its email.
   * @param email
   * @returns UserModel
   * @name getUserByEmail
   * @throws Error
   */
  async getUserByEmail(email: string): Promise<UserModel | null> {
    const query = `SELECT * FROM \`${this.collectionName}\`  WHERE ${ILike('email', email)}`;
    try {
      const user = await this.scope.query(query);
      if (user.rows.length > 0) {
        return this.transformCouchbaseResultToUserModel(user.rows[0].users);
      }
      return null;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  }

  /**
   * Retrieves a list of users from the database.
   * @param options
   * @returns Promise<UserModel[]>
   * @throws Error
   * @name find
   */
  async find(options?: IFindOptions<UserModel>): Promise<UserModel[]> {
    const builder = new CouchbaseQueryBuilder<UserModel>()
      .findAll()
      .from(this.collectionName)
      .where(options.where)
      .limit(options.limit)
      .offset((options.offset - 1) * options.limit)
      .build();
    try {
      const result: QueryResult = await this.scope.query(builder);
      return this.transformCouchbaseResultToUsersModel(result.rows);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Retrieves a paginated list of users from the database.
   * @param options
   * @param searchOptions
   * @returns Promise<IPaginateResult<UserModel>>
   * @throws Error
   * @name paginate
   */
  async paginate(
    options: IPaginateOptions,
    searchOptions?: IFindOptions<UserModel>,
  ): Promise<IPaginateResult<UserModel>> {
    const { page, limit, sort } = options;

    const builder = new CouchbaseQueryBuilder<UserModel>()
      .findAll()
      .from(this.collectionName)
      .where(searchOptions.where)
      .orderBy(sort)
      .limit(limit)
      .offset((page - 1) * limit)
      .build();

    try {
      const result: QueryResult = await this.scope.query(builder);
      return {
        data: this.transformCouchbaseResultToUsersModel(result.rows),
        limit,
        itemCount: result.rows.length,
        itemsPerPage: limit,
        currentPage: page,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Retrieves a single user from the database.
   * @param options
   * @returns Promise<UserModel | null>
   * @throws Error
   * @name findOne
   */
  async findOne(
    options: IFindOneOptions<UserModel>,
  ): Promise<UserModel | null> {
    const builder = new CouchbaseQueryBuilder<UserModel>()
      .findOne()
      .from(this.collectionName)
      .where(options.where)
      .build();
    try {
      const result: QueryResult = await this.scope.query(builder);

      if (result.rows.length > 0) {
        return this.transformCouchbaseResultToUserModel(result.rows[0].users);
      }
      return null;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Saves a new user to the database.
   * @param user
   * @returns Promise<UserModel>
   * @throws Error
   * @name save
   */
  async save(user: UserModel): Promise<UserModel> {
    try {
      const userId = uuidv4();
      const userDocument = {
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: userId,
      };
      await this.collection.insert(userId, userDocument);
      return this.transformCouchbaseResultToUserModel(userDocument);
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  }

  /**
   * Deletes a user from the database.
   * @param id
   * @returns Promise<string>
   * @throws Error
   * @name delete
   */
  async delete(id: string): Promise<string> {
    try {
      await this.collection.remove(id);
      return id;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Updates an existing user in the database.
   * @param id
   * @param user
   * @returns Promise<UserModel>
   * @throws Error
   * @name update
   */
  async update(id: string, user: Partial<UserModel>): Promise<UserModel> {
    try {
      const existingUser = await this.collection.get(id);

      if (!existingUser) {
        return null;
      }
      const userDocument = {
        id: id,
        firstName: user.firstName || existingUser.content.firstName,
        lastName: user.lastName || existingUser.content.lastName,
        avatarUrl: user.avatarUrl || existingUser.content.avatarUrl,
        password: existingUser.content.password,
        email: existingUser.content.email,
        createdAt: existingUser.content.createdAt,
        updatedAt: new Date().toISOString(),
      };
      await this.collection.upsert(id, userDocument);
      return this.transformCouchbaseResultToUserModel(userDocument);
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  }

  /**
   * Transforms a Couchbase result to a user model.
   * @param row
   * @private
   * @name transformCouchbaseResultToUserModel
   */
  private transformCouchbaseResultToUserModel(row: any): UserModel {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.firstName,
      lastName: row.lastName,
      avatarUrl: row.avatarUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * Transforms a Couchbase result to a list of user models.
   * @param rows
   * @private
   * @name transformCouchbaseResultToUsersModel
   */
  private transformCouchbaseResultToUsersModel(rows: any[]): UserModel[] {
    return rows.map((row) =>
      this.transformCouchbaseResultToUserModel(row.users),
    );
  }
}
