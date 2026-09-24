import { CreateTechnologyDTO, TechnologyResponseDTO } from '../dtos/technology.dto';
import { technologyRepository, TechnologyRepository } from '../repositories/technology.repository';
import { AppError } from '../errors/app-error';

export class TechnologyService {
  constructor(private readonly repo: TechnologyRepository = technologyRepository) {}

  async createTechnology(data: CreateTechnologyDTO): Promise<TechnologyResponseDTO> {
    const existing = await this.repo.findByName(data.name);
    if (existing) {
      throw new AppError('Tecnologia já cadastrada com este nome', 409);
    }

    const tech = await this.repo.create({
      name: data.name,
    });

    return {
      id: tech.id,
      name: tech.name,
      createdAt: tech.createdAt,
    };
  }

  async getAllTechnologies(): Promise<TechnologyResponseDTO[]> {
    const techs = await this.repo.findAll();
    return techs.map((t) => ({
      id: t.id,
      name: t.name,
      createdAt: t.createdAt,
    }));
  }
}

export const technologyService = new TechnologyService();
