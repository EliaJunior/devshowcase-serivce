import { Feedback } from '@prisma/client';
import prisma from '../config/prisma';

export interface CreateFeedbackInput {
  projectId: string;
  authorName: string;
  comment: string;
  rating: number;
}

export class FeedbackRepository {
  async create(data: CreateFeedbackInput): Promise<Feedback> {
    return prisma.feedback.create({
      data: {
        authorName: data.authorName,
        comment: data.comment,
        rating: data.rating,
        project: {
          connect: { id: data.projectId },
        },
      },
    });
  }

  async findByProjectId(projectId: string): Promise<Feedback[]> {
    return prisma.feedback.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({
      where: { id },
    });
  }

  async calculateAverageRatingByProjectId(projectId: string): Promise<number> {
    const result = await prisma.feedback.aggregate({
      _avg: {
        rating: true,
      },
      where: { projectId },
    });

    if (result._avg.rating === null || result._avg.rating === undefined) {
      return 0;
    }

    // Arredonda para 2 casas decimais
    return Math.round(result._avg.rating * 100) / 100;
  }
}

export const feedbackRepository = new FeedbackRepository();
