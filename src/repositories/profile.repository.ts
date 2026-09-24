import { Profile, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class ProfileRepository {
  async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
    return prisma.profile.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.profile.findUnique({
      where: { id },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            repositoryUrl: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<Profile[]> {
    return prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<Profile> {
    return prisma.profile.delete({
      where: { id },
    });
  }
}

export const profileRepository = new ProfileRepository();
