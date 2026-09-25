import { CreateFeedbackDTO, FeedbackResponseDTO } from '../dtos/feedback.dto';
import { feedbackRepository, FeedbackRepository } from '../repositories/feedback.repository';
import { projectRepository, ProjectRepository } from '../repositories/project.repository';
import { AppError } from '../errors/app-error';

export class FeedbackService {
  constructor(
    private readonly feedbackRepo: FeedbackRepository = feedbackRepository,
    private readonly projectRepo: ProjectRepository = projectRepository
  ) {}

  async createFeedback(projectId: string, data: CreateFeedbackDTO): Promise<FeedbackResponseDTO> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }

    const feedback = await this.feedbackRepo.create({
      projectId,
      authorName: data.authorName,
      comment: data.comment,
      rating: data.rating,
    });

    const averageRating = await this.feedbackRepo.calculateAverageRatingByProjectId(projectId);
    await this.projectRepo.updateAverageRating(projectId, averageRating);

    return {
      id: feedback.id,
      projectId: feedback.projectId,
      authorName: feedback.authorName,
      comment: feedback.comment,
      rating: feedback.rating,
      createdAt: feedback.createdAt,
    };
  }

  async getFeedbacksByProjectId(projectId: string): Promise<FeedbackResponseDTO[]> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }

    const feedbacks = await this.feedbackRepo.findByProjectId(projectId);
    return feedbacks.map((f) => ({
      id: f.id,
      projectId: f.projectId,
      authorName: f.authorName,
      comment: f.comment,
      rating: f.rating,
      createdAt: f.createdAt,
    }));
  }
}

export const feedbackService = new FeedbackService();
