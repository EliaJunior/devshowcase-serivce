import { Request, Response, NextFunction } from 'express';
import { projectService, ProjectService } from '../services/project.service';
import { queryProjectSchema, QueryProjectDTO } from '../dtos/project.dto';

export class ProjectController {
  constructor(private readonly service: ProjectService = projectService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.service.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedQuery: QueryProjectDTO =
        (res.locals.validatedQuery as QueryProjectDTO) || queryProjectSchema.parse(req.query);
      const result = await this.service.getAllProjects(validatedQuery);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const project = await this.service.getProjectById(id);
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  };

  upvote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const project = await this.service.upvoteProject(id);
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  };
}

export const projectController = new ProjectController();
