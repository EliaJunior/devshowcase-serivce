import { Request, Response, NextFunction } from 'express';
import { feedbackService, FeedbackService } from '../services/feedback.service';

export class FeedbackController {
  constructor(private readonly service: FeedbackService = feedbackService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projectId = req.params.id as string;
      const feedback = await this.service.createFeedback(projectId, req.body);
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  };

  getByProjectId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projectId = req.params.id as string;
      const feedbacks = await this.service.getFeedbacksByProjectId(projectId);
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  };
}

export const feedbackController = new FeedbackController();
