import { CreateProfileDTO, ProfileResponseDTO } from '../dtos/profile.dto';
import { profileRepository, ProfileRepository } from '../repositories/profile.repository';
import { AppError } from '../errors/app-error';

export class ProfileService {
  constructor(private readonly repo: ProfileRepository = profileRepository) {}

  async createProfile(data: CreateProfileDTO): Promise<ProfileResponseDTO> {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email já cadastrado para outro desenvolvedor', 409);
    }

    const profile = await this.repo.create({
      name: data.name,
      email: data.email,
      bio: data.bio ?? null,
    });

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      projects: [],
    };
  }

  async getProfileById(id: string): Promise<ProfileResponseDTO> {
    const profile = await this.repo.findById(id);
    if (!profile) {
      throw new AppError('Perfil não encontrado', 404);
    }

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      projects: profile.projects,
    };
  }

  async getAllProfiles(): Promise<ProfileResponseDTO[]> {
    const profiles = await this.repo.findAll();
    return profiles.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      bio: p.bio,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }
}

export const profileService = new ProfileService();
