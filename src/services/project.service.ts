import {
  CreateProjectDTO,
  ProjectResponseDTO,
  QueryProjectDTO,
  PaginatedProjectsResponseDTO,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from '../dtos/project.dto';
import { projectRepository, ProjectRepository } from '../repositories/project.repository';
import { profileRepository, ProfileRepository } from '../repositories/profile.repository';
import { technologyRepository, TechnologyRepository } from '../repositories/technology.repository';
import { AppError } from '../errors/app-error';

export class ProjectService {
  constructor(
    private readonly projectRepo: ProjectRepository = projectRepository,
    private readonly profileRepo: ProfileRepository = profileRepository,
    private readonly techRepo: TechnologyRepository = technologyRepository
  ) {}

  async createProject(data: CreateProjectDTO): Promise<ProjectResponseDTO> {
    const profile = await this.profileRepo.findById(data.profileId);
    if (!profile) {
      throw new AppError('Perfil associado não encontrado', 404);
    }

    const technologyIds = data.technologyIds || [];
    if (technologyIds.length > 0) {
      const existingTechs = await this.techRepo.findByIds(technologyIds);
      if (existingTechs.length !== technologyIds.length) {
        throw new AppError('Uma ou mais tecnologias informadas não foram encontradas', 404);
      }
    }

    const project = await this.projectRepo.create({
      title: data.title,
      description: data.description,
      repositoryUrl: data.repositoryUrl,
      profileId: data.profileId,
      technologyIds,
    });

    return project;
  }

  async getAllProjects(filters?: QueryProjectDTO): Promise<PaginatedProjectsResponseDTO> {
    const page = filters?.page ?? DEFAULT_PAGE;
    const limit = filters?.limit ?? DEFAULT_LIMIT;
    const technology = filters?.technology;

    const { projects, total } = await this.projectRepo.findAll({
      technology,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getProjectById(id: string): Promise<ProjectResponseDTO> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }
    return project;
  }

  async upvoteProject(id: string): Promise<ProjectResponseDTO> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }

    return this.projectRepo.incrementUpvotes(id);
  }
}

export const projectService = new ProjectService();
