import { Technology, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class TechnologyRepository {
  async create(data: Prisma.TechnologyCreateInput): Promise<Technology> {
    return prisma.technology.create({
      data,
    });
  }

  async findByName(name: string): Promise<Technology | null> {
    return prisma.technology.findUnique({
      where: { name },
    });
  }

  async findById(id: string): Promise<Technology | null> {
    return prisma.technology.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Technology[]> {
    return prisma.technology.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByIds(ids: string[]): Promise<Technology[]> {
    return prisma.technology.findMany({
      where: {
        id: { in: ids },
      },
    });
  }
}

export const technologyRepository = new TechnologyRepository();
