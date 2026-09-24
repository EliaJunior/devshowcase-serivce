import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z
    .string({ message: 'O nome é obrigatório' })
    .trim()
    .min(1, 'O nome não pode ser vazio')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  email: z
    .string({ message: 'O email é obrigatório' })
    .trim()
    .email('O email deve ser válido'),
  bio: z
    .string()
    .trim()
    .max(500, 'A biografia deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
});

export type CreateProfileDTO = z.infer<typeof createProfileSchema>;

export interface ProfileResponseDTO {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  projects?: Array<{
    id: string;
    title: string;
    description: string | null;
    repositoryUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
