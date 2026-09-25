import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Endpoint de health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Documentação interativa via Swagger / OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs', (_req: Request, res: Response) => {
  res.redirect('/api-docs');
});

// Prefixo das rotas da API
app.use('/api', apiRoutes);

// Tratamento de rota não encontrada (404)
app.use(notFoundHandler);

// Tratamento centralizado de erros
app.use(errorHandler);

export default app;
