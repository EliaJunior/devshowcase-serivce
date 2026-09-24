import { Request, Response, NextFunction } from 'express';
import { projectService, ProjectService } from '../services/project.service';

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

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projects = await this.service.getAllProjects();
      res.status(200).json(projects);
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
}

export const projectController = new ProjectController();
