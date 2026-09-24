import { z } from 'zod';

export const createTechnologySchema = z.object({
  name: z
    .string({ message: 'O nome da tecnologia é obrigatório' })
    .trim()
    .min(1, 'O nome da tecnologia não pode ser vazio')
    .max(50, 'O nome da tecnologia deve ter no máximo 50 caracteres'),
});

export type CreateTechnologyDTO = z.infer<typeof createTechnologySchema>;

export interface TechnologyResponseDTO {
  id: string;
  name: string;
  createdAt: Date;
}
