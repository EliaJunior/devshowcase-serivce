import { z } from 'zod';
import { FeedbackResponseDTO } from './feedback.dto';
import { TechnologyResponseDTO } from './technology.dto';

export const createProjectSchema = z.object({
  title: z
    .string({ message: 'O título é obrigatório' })
    .trim()
    .min(1, 'O título não pode ser vazio')
    .max(150, 'O título deve ter no máximo 150 caracteres'),
  description: z
    .string()
    .trim()
    .max(2000, 'A descrição deve ter no máximo 2000 caracteres')
    .optional()
    .nullable(),
  repositoryUrl: z
    .string({ message: 'A URL do repositório é obrigatória' })
    .trim()
    .url('A URL do repositório deve ser válida (ex: https://github.com/usuario/repo)'),
  profileId: z
    .string({ message: 'O profileId é obrigatório' })
    .uuid('O profileId deve ser um UUID válido'),
  technologyIds: z
    .array(z.string().uuid('Cada tecnologia deve ter um UUID válido'))
    .optional()
    .default([]),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;

export interface ProjectResponseDTO {
  id: string;
  title: string;
  description: string | null;
  repositoryUrl: string;
  profileId: string;
  profile?: {
    id: string;
    name: string;
    email: string;
  };
  technologies?: TechnologyResponseDTO[];
  feedbacks?: FeedbackResponseDTO[];
  createdAt: Date;
  updatedAt: Date;
}
