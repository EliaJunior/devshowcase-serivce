import { z } from 'zod';

export const createFeedbackSchema = z.object({
  authorName: z
    .string({ message: 'O nome do autor é obrigatório' })
    .trim()
    .min(1, 'O nome do autor não pode ser vazio')
    .max(100, 'O nome do autor deve ter no máximo 100 caracteres'),
  comment: z
    .string({ message: 'O comentário é obrigatório' })
    .trim()
    .min(1, 'O comentário não pode ser vazio')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres'),
  rating: z
    .number({ message: 'A avaliação (rating) é obrigatória' })
    .int('A avaliação deve ser um número inteiro')
    .min(1, 'A avaliação mínima é 1')
    .max(5, 'A avaliação máxima é 5'),
});

export type CreateFeedbackDTO = z.infer<typeof createFeedbackSchema>;

export interface FeedbackResponseDTO {
  id: string;
  projectId: string;
  authorName: string;
  comment: string;
  rating: number;
  createdAt: Date;
}
