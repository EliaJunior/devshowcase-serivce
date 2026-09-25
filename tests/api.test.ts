import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('DevShowcase REST API Integration Tests', () => {
  beforeAll(async () => {
    // Limpar o banco de dados antes dos testes
    await prisma.feedback.deleteMany();
    await prisma.project.deleteMany();
    await prisma.technology.deleteMany();
    await prisma.profile.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Testes de Health Check e Documentação Swagger
  it('GET /health - deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api-docs/ - deve carregar a interface interativa do Swagger UI', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Swagger UI');
  });

  it('GET /docs - deve redirecionar para /api-docs', async () => {
    const res = await request(app).get('/docs');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/api-docs');
  });

  // Variáveis para guardar IDs criados e usar nos testes seguintes
  let createdProfileId: string;
  let createdTechId1: string;
  let createdTechId2: string;
  let createdProjectId: string;

  // 1. Testes de Profile
  describe('Profile Endpoints (/api/profiles)', () => {
    it('POST /api/profiles - deve criar um perfil com sucesso (201)', async () => {
      const payload = {
        name: 'Ana Dev',
        email: 'ana.dev@example.com',
        bio: 'Fullstack Developer apaixonada por TypeScript e Node.js',
      };

      const res = await request(app).post('/api/profiles').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(payload.name);
      expect(res.body.email).toBe(payload.email);
      expect(res.body.bio).toBe(payload.bio);
      expect(res.body.projects).toEqual([]);

      createdProfileId = res.body.id;
    });

    it('POST /api/profiles - deve falhar com 400 se campos obrigatórios forem inválidos', async () => {
      const res = await request(app).post('/api/profiles').send({
        name: '',
        email: 'email-invalido',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Dados de entrada inválidos');
      expect(res.body.errors).toBeInstanceOf(Array);
      expect(res.body.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('POST /api/profiles - deve falhar com 409 ao tentar cadastrar email duplicado', async () => {
      const res = await request(app).post('/api/profiles').send({
        name: 'Ana Duplicada',
        email: 'ana.dev@example.com',
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('já cadastrado');
    });

    it('GET /api/profiles/:id - deve buscar perfil por ID com seus projetos (200)', async () => {
      const res = await request(app).get(`/api/profiles/${createdProfileId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdProfileId);
      expect(res.body.name).toBe('Ana Dev');
      expect(Array.isArray(res.body.projects)).toBe(true);
    });

    it('GET /api/profiles/:id - deve retornar 404 para ID inexistente', async () => {
      const res = await request(app).get('/api/profiles/non-existing-id');

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Perfil não encontrado');
    });

    it('GET /api/profiles - deve listar todos os perfis', async () => {
      const res = await request(app).get('/api/profiles');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  // 2. Testes de Technology
  describe('Technology Endpoints (/api/technologies)', () => {
    it('POST /api/technologies - deve criar tecnologia com sucesso (201)', async () => {
      const res1 = await request(app).post('/api/technologies').send({ name: 'TypeScript' });
      expect(res1.status).toBe(201);
      expect(res1.body.name).toBe('TypeScript');
      createdTechId1 = res1.body.id;

      const res2 = await request(app).post('/api/technologies').send({ name: 'Express' });
      expect(res2.status).toBe(201);
      expect(res2.body.name).toBe('Express');
      createdTechId2 = res2.body.id;
    });

    it('POST /api/technologies - deve falhar com 400 se nome for vazio', async () => {
      const res = await request(app).post('/api/technologies').send({ name: '' });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].field).toBe('name');
    });

    it('POST /api/technologies - deve falhar com 409 se tecnologia já existir', async () => {
      const res = await request(app).post('/api/technologies').send({ name: 'TypeScript' });
      expect(res.status).toBe(409);
      expect(res.body.message).toContain('já cadastrada');
    });

    it('GET /api/technologies - deve listar todas as tecnologias (200)', async () => {
      const res = await request(app).get('/api/technologies');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((t: { name: string }) => t.name === 'TypeScript')).toBe(true);
      expect(res.body.some((t: { name: string }) => t.name === 'Express')).toBe(true);
    });
  });

  // 3. Testes de Project
  describe('Project Endpoints (/api/projects)', () => {
    it('POST /api/projects - deve cadastrar projeto associando profile e tecnologias (201)', async () => {
      const payload = {
        title: 'DevShowcase API',
        description: 'Serviço de vitrine de desenvolvedores e portfólio de projetos',
        repositoryUrl: 'https://github.com/EliaJunior/devshowcase-serivce',
        profileId: createdProfileId,
        technologyIds: [createdTechId1, createdTechId2],
      };

      const res = await request(app).post('/api/projects').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe(payload.title);
      expect(res.body.repositoryUrl).toBe(payload.repositoryUrl);
      expect(res.body.profileId).toBe(createdProfileId);
      expect(res.body.upvotes).toBe(0);
      expect(res.body.averageRating).toBe(0);
      expect(res.body.profile).toBeDefined();
      expect(res.body.profile.email).toBe('ana.dev@example.com');
      expect(res.body.technologies).toHaveLength(2);

      createdProjectId = res.body.id;
    });

    it('POST /api/projects - deve falhar com 400 para URLs inválidas ou campos vazios', async () => {
      const res = await request(app).post('/api/projects').send({
        title: '',
        repositoryUrl: 'url-invalida',
        profileId: 'nao-e-uuid',
      });

      expect(res.status).toBe(400);
      expect(res.body.errors.some((e: { field: string }) => e.field === 'title')).toBe(true);
      expect(res.body.errors.some((e: { field: string }) => e.field === 'repositoryUrl')).toBe(true);
      expect(res.body.errors.some((e: { field: string }) => e.field === 'profileId')).toBe(true);
    });

    it('POST /api/projects - deve falhar com 404 se profileId não existir', async () => {
      const res = await request(app).post('/api/projects').send({
        title: 'Outro Projeto',
        repositoryUrl: 'https://github.com/outro/repo',
        profileId: 'a0000000-0000-4000-8000-000000000000',
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Perfil associado não encontrado');
    });

    it('GET /api/projects - deve listar projetos com formato paginado (200)', async () => {
      const res = await request(app).get('/api/projects');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);

      const proj = res.body.data.find((p: { id: string }) => p.id === createdProjectId);
      expect(proj).toBeDefined();
      expect(proj.profile).toBeDefined();
      expect(proj.technologies).toHaveLength(2);
      expect(Array.isArray(proj.feedbacks)).toBe(true);
    });

    it('GET /api/projects?technology=TypeScript - deve filtrar projetos por tecnologia (200)', async () => {
      const res = await request(app).get('/api/projects?technology=TypeScript');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(
        res.body.data.some((p: { id: string }) => p.id === createdProjectId)
      ).toBe(true);
    });

    it('GET /api/projects?technology=TechInexistente - deve retornar lista vazia (200)', async () => {
      const res = await request(app).get('/api/projects?technology=TechInexistente');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.pagination.total).toBe(0);
    });

    it('GET /api/projects?page=1&limit=1 - deve respeitar limites de paginação (200)', async () => {
      const res = await request(app).get('/api/projects?page=1&limit=1');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
    });

    it('GET /api/projects/:id - deve buscar projeto por ID com detalhes', async () => {
      const res = await request(app).get(`/api/projects/${createdProjectId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdProjectId);
      expect(res.body.title).toBe('DevShowcase API');
      expect(res.body.technologies).toHaveLength(2);
    });

    it('PUT /api/projects/:id/upvote - deve incrementar as curtidas do projeto com sucesso (200)', async () => {
      const res1 = await request(app).put(`/api/projects/${createdProjectId}/upvote`);
      expect(res1.status).toBe(200);
      expect(res1.body.id).toBe(createdProjectId);
      expect(res1.body.upvotes).toBe(1);

      const res2 = await request(app).put(`/api/projects/${createdProjectId}/upvote`);
      expect(res2.status).toBe(200);
      expect(res2.body.upvotes).toBe(2);
    });

    it('PUT /api/projects/:id/upvote - deve falhar com 404 para projeto inexistente', async () => {
      const res = await request(app).put('/api/projects/a0000000-0000-4000-8000-000000000000/upvote');
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Projeto não encontrado');
    });
  });

  // 4. Testes de Feedback com Cálculo de Média
  describe('Feedback Endpoints (/api/projects/:id/feedbacks)', () => {
    it('POST /api/projects/:id/feedbacks - deve cadastrar 1º feedback e atualizar a média do projeto para 5 (201)', async () => {
      const payload = {
        authorName: 'Tech Lead Carlos',
        comment: 'Excelente arquitetura e organização de camadas!',
        rating: 5,
      };

      const res = await request(app)
        .post(`/api/projects/${createdProjectId}/feedbacks`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.projectId).toBe(createdProjectId);
      expect(res.body.authorName).toBe(payload.authorName);
      expect(res.body.comment).toBe(payload.comment);
      expect(res.body.rating).toBe(5);

      // Verificar se a média do projeto foi atualizada para 5.0
      const projectRes = await request(app).get(`/api/projects/${createdProjectId}`);
      expect(projectRes.status).toBe(200);
      expect(projectRes.body.averageRating).toBe(5.0);
    });

    it('POST /api/projects/:id/feedbacks - deve cadastrar 2º feedback e atualizar a média para 4 (201)', async () => {
      const payload = {
        authorName: 'Mariana Reviewer',
        comment: 'Muito bom, mas pode melhorar o tempo de resposta.',
        rating: 3,
      };

      const res = await request(app)
        .post(`/api/projects/${createdProjectId}/feedbacks`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.rating).toBe(3);

      // Verificar se a média foi recalculada: (5 + 3) / 2 = 4.0
      const projectRes = await request(app).get(`/api/projects/${createdProjectId}`);
      expect(projectRes.status).toBe(200);
      expect(projectRes.body.averageRating).toBe(4.0);
    });

    it('POST /api/projects/:id/feedbacks - deve falhar com 400 se rating for maior que 5', async () => {
      const res = await request(app)
        .post(`/api/projects/${createdProjectId}/feedbacks`)
        .send({
          authorName: 'Carlos',
          comment: 'Muito bom',
          rating: 10,
        });

      expect(res.status).toBe(400);
      expect(res.body.errors.some((e: { field: string }) => e.field === 'rating')).toBe(true);
    });

    it('GET /api/projects/:id/feedbacks - deve listar os feedbacks do projeto (200)', async () => {
      const res = await request(app).get(`/api/projects/${createdProjectId}/feedbacks`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body.some((f: { authorName: string }) => f.authorName === 'Tech Lead Carlos')).toBe(true);
    });

    it('GET /api/profiles/:id - agora deve incluir o projeto cadastrado', async () => {
      const res = await request(app).get(`/api/profiles/${createdProfileId}`);

      expect(res.status).toBe(200);
      expect(res.body.projects.length).toBe(1);
      expect(res.body.projects[0].id).toBe(createdProjectId);
      expect(res.body.projects[0].title).toBe('DevShowcase API');
    });
  });
});
