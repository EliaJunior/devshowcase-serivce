import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = result.error as ZodError;
      const formattedErrors = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      res.status(400).json({
        message: 'Dados de entrada inválidos',
        errors: formattedErrors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
};
