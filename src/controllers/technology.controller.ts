import { Request, Response, NextFunction } from 'express';
import { technologyService, TechnologyService } from '../services/technology.service';

export class TechnologyController {
  constructor(private readonly service: TechnologyService = technologyService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tech = await this.service.createTechnology(req.body);
      res.status(201).json(tech);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const techs = await this.service.getAllTechnologies();
      res.status(200).json(techs);
    } catch (error) {
      next(error);
    }
  };
}

export const technologyController = new TechnologyController();
