
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class ProjectFilterInput {
    page: number;
    limit: number;
}

export class CreateProjectInput {
    name: string;
    description: string;
    createdBy?: Nullable<string>;
}

export class UpdateProjectInput {
    name?: Nullable<string>;
    description?: Nullable<string>;
    createdBy?: Nullable<string>;
    id: string;
}

export class User {
    id: string;
}

export class Project {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    user?: Nullable<User>;
}

export class PaginateProject {
    data: Project[];
    limit: number;
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
}

export abstract class IQuery {
    abstract ping(): string | Promise<string>;

    abstract userProjects(filter: ProjectFilterInput): PaginateProject | Promise<PaginateProject>;

    abstract projects(filter: ProjectFilterInput): PaginateProject | Promise<PaginateProject>;

    abstract project(id: string): Project | Promise<Project>;
}

export abstract class IMutation {
    abstract project(input: CreateProjectInput): Project | Promise<Project>;

    abstract updateProject(input: UpdateProjectInput): Project | Promise<Project>;

    abstract deleteProject(id: string): string | Promise<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;
