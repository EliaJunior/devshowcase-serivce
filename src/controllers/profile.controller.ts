import { Request, Response, NextFunction } from 'express';
import { profileService, ProfileService } from '../services/profile.service';

export class ProfileController {
  constructor(private readonly service: ProfileService = profileService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.service.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const profile = await this.service.getProfileById(id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profiles = await this.service.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      next(error);
    }
  };
}

export const profileController = new ProfileController();
