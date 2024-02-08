import { IProjectRepository } from '../../domain/repositories';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bucket, Cluster, Collection, QueryResult, Scope } from 'couchbase';
import { couchbaseConnectionConfig } from '../config/couchbase/couchbase.config';
import { ProjectModel } from '../../domain/model';
import { IFindOneOptions, IFindOptions } from '../../domain/adapters';
import { IPaginateOptions, IPaginateResult } from '../../domain/adapters';
import { v4 as uuidv4 } from 'uuid';
import { ILike } from './database';
import { getErrorMessage } from './database';
import { CouchbaseQueryBuilder } from './database/couchbase.query.builder';

/**
 * ProjectRepository  responsible for managing project data in the Couchbase database.
 * This repository handles CRUD operations for project data.
 * @implements IProjectRepository
 */
@Injectable()
export class ProjectRepository implements IProjectRepository, OnModuleInit {
  private collection: Collection;
  private scope: Scope;
  private bucket: Bucket;
  private collectionName = 'projects';
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
   * Get a project by its name.
   * @param name
   * @returns ProjectModel
   * @name getProjectByName
   * @throws Error
   */
  async getProjectByName(name: string): Promise<ProjectModel | null> {
    const query = `
    SELECT * FROM \`${this.collectionName}\` 
    WHERE ${ILike('name', name)}
  `;
    try {
      const project = await this.scope.query(query);

      if (project.rows.length > 0) {
        return project.rows[0].projects;
      }
      return null;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  }

  /**
   * Find projects based on the options provided.
   * @param options
   * @returns Promise<ProjectModel[]>
   * @throws Error
   * @name find
   */
  async find(options: IFindOptions<ProjectModel>): Promise<ProjectModel[]> {
    const builder = new CouchbaseQueryBuilder<ProjectModel>()
      .findAll()
      .from(this.collectionName)
      .where(options.where)
      .limit(options.limit)
      .offset((options.offset - 1) * options.limit)
      .build();
    try {
      const result: QueryResult = await this.scope.query(builder);
      return this.transformCouchbaseProjectsToModel(result.rows);
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  }

  /**
   * Get a project by its id.
   * @param options IFindOneOptions
   * @returns ProjectModel
   * @name findOne
   * @throws Error
   */
  async findOne(options: IFindOneOptions<ProjectModel>): Promise<ProjectModel> {
    const builder = new CouchbaseQueryBuilder<ProjectModel>()
      .findOne()
      .from(this.collectionName)
      .where(options.where)
      .build();

    try {
      const result: QueryResult = await this.scope.query(builder);

      if (result.rows.length > 0) {
        return this.transformProjectToModel(result.rows[0].projects);
      }
      return null;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Paginate projects based on the options provided.
   * @param options IPaginateOptions
   * @param searchOptions IFindOptions<ProjectModel>
   * @returns Promise<IPaginateResult<ProjectModel>>
   * @throws Error
   * @name paginate
   */
  async paginate(
    options: IPaginateOptions,
    searchOptions?: IFindOptions<ProjectModel>,
  ): Promise<IPaginateResult<ProjectModel>> {
    const { page, limit, sort } = options;
    const builder = new CouchbaseQueryBuilder<ProjectModel>()
      .findAll()
      .from(this.collectionName)
      .where(searchOptions.where)
      .orderBy(sort)
      .limit(limit)
      .offset((page - 1) * limit)
      .build();

    try {
      const result: QueryResult = await this.scope.query(builder, {
        parameters:
          searchOptions && searchOptions.where
            ? Object.values(searchOptions.where)
            : [],
      });
      return {
        data: this.transformCouchbaseProjectsToModel(result.rows),
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
   * Save a project to the database.
   * @param project ProjectModel
   * @returns Promise<ProjectModel>
   * @throws Error
   * @name save
   */
  async save(project: ProjectModel): Promise<ProjectModel> {
    const projectId = uuidv4();
    const projectDocument = {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: projectId,
    };
    await this.collection.insert(projectId, projectDocument);
    return this.transformProjectToModel(projectDocument);
  }

  /**
   * Delete a project from the database.
   * @param id string
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
   * Update an existing project in the database.
   * @param id string
   * @param project Partial<ProjectModel>
   * @returns Promise<ProjectModel>
   * @throws Error
   * @name update
   */
  async update(
    id: string,
    project: Partial<ProjectModel>,
  ): Promise<ProjectModel> {
    const existingProject = await this.collection.get(id);

    if (!existingProject) {
      return null;
    }
    const userDocument = {
      id: id,
      name: project.name || existingProject.content.name,
      description: project.description || existingProject.content.description,
      createdBy: project.createdBy || existingProject.content.createdBy,
      createdAt: existingProject.content.createdAt,
      updatedAt: new Date().toISOString(),
    };
    await this.collection.upsert(id, userDocument);
    return this.transformProjectToModel(userDocument);
  }

  private transformProjectToModel(project: any): ProjectModel {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdBy: project.createdBy,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private transformCouchbaseProjectsToModel(project: any[]): ProjectModel[] {
    return project.map((row) => this.transformProjectToModel(row.projects));
  }
}
