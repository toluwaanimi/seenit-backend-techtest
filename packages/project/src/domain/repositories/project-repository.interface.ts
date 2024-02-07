import { ProjectModel } from '../model';
import { IBaseRepository } from '../abstract';

/**
 * Project repository interface
 * @interface IProjectRepository  - Project repository interface
 * @extends {IBaseRepository<ProjectModel>} - Extends IBaseRepository<ProjectModel> interface from abstract folder
 */
export interface IProjectRepository extends IBaseRepository<ProjectModel> {
  getProjectByName(name: string): Promise<ProjectModel | null>;
}
