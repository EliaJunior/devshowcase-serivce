import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/app-error';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  // Tratamento de conflito de chave única no Prisma (P2002)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[]) || ['campo'];
      res.status(409).json({
        message: `Já existe um registro com este valor para o campo: ${target.join(', ')}`,
      });
      return;
    }
  }

  console.error('Unhandled Server Error:', error);

  res.status(500).json({
    message: 'Erro interno do servidor',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
  });
};
