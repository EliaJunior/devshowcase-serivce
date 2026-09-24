import prisma from '../config/prisma';

export interface CreateProjectInput {
  title: string;
  description?: string | null;
  repositoryUrl: string;
  profileId: string;
  technologyIds?: string[];
}

export class ProjectRepository {
  async create(input: CreateProjectInput) {
    const { title, description, repositoryUrl, profileId, technologyIds = [] } = input;

    return prisma.project.create({
      data: {
        title,
        description,
        repositoryUrl,
        profile: {
          connect: { id: profileId },
        },
        technologies: technologyIds.length > 0
          ? {
              connect: technologyIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        profile: {
          select: { id: true, name: true, email: true },
        },
        technologies: {
          select: { id: true, name: true, createdAt: true },
        },
        feedbacks: {
          select: {
            id: true,
            projectId: true,
            authorName: true,
            comment: true,
            rating: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findAll() {
    return prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: { id: true, name: true, email: true },
        },
        technologies: {
          select: { id: true, name: true, createdAt: true },
        },
        feedbacks: {
          select: {
            id: true,
            projectId: true,
            authorName: true,
            comment: true,
            rating: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        profile: {
          select: { id: true, name: true, email: true },
        },
        technologies: {
          select: { id: true, name: true, createdAt: true },
        },
        feedbacks: {
          select: {
            id: true,
            projectId: true,
            authorName: true,
            comment: true,
            rating: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
}

export const projectRepository = new ProjectRepository();
