export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'DevShowcase REST API Service',
    version: '1.0.0',
    description:
      'API RESTful para vitrine de desenvolvedores, gerenciamento de projetos de portfólio, catálogo de tecnologias e avaliações/feedbacks técnicos com regras avançadas e persistência no PostgreSQL.',
    contact: {
      name: 'Elias Cunha',
      url: 'https://github.com/EliaJunior/devshowcase-serivce',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Servidor Atual (Relativo)',
    },
    {
      url: 'http://localhost:3000',
      description: 'Ambiente Local de Desenvolvimento',
    },
    {
      url: 'https://devshowcase-serivce.onrender.com',
      description: 'Ambiente de Produção (Render)',
    },
  ],
  tags: [
    {
      name: 'Health Check',
      description: 'Verificação de integridade e disponibilidade da API',
    },
    {
      name: 'Perfis (Profiles)',
      description: 'Gerenciamento de perfis de desenvolvedores',
    },
    {
      name: 'Tecnologias (Technologies)',
      description: 'Catálogo de tecnologias e linguagens',
    },
    {
      name: 'Projetos (Projects)',
      description: 'Projetos de portfólio com filtro, paginação e curtidas/upvotes',
    },
    {
      name: 'Feedbacks (Avaliações)',
      description: 'Avaliações técnicas com cálculo automático de nota média',
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health Check'],
        summary: 'Verificar status da API',
        description: 'Retorna o status de integridade do serviço e o timestamp atual.',
        responses: {
          '200': {
            description: 'Serviço operacional',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', example: '2026-09-25T13:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/profiles': {
      post: {
        tags: ['Perfis (Profiles)'],
        summary: 'Criar perfil de desenvolvedor',
        description: 'Cadastra um novo perfil com nome, email único e biografia opcional.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProfileDTO' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Perfil criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProfileResponse' },
              },
            },
          },
          '400': {
            description: 'Dados de entrada inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '409': {
            description: 'Email já cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Perfis (Profiles)'],
        summary: 'Listar todos os perfis',
        description: 'Retorna a lista de todos os perfis de desenvolvedores cadastrados.',
        responses: {
          '200': {
            description: 'Lista de perfis',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ProfileResponse' },
                },
              },
            },
          },
        },
      },
    },
    '/api/profiles/{id}': {
      get: {
        tags: ['Perfis (Profiles)'],
        summary: 'Buscar perfil por ID',
        description: 'Retorna os detalhes de um perfil e a lista de seus projetos cadastrados.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do perfil',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Perfil encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProfileResponse' },
              },
            },
          },
          '404': {
            description: 'Perfil não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/technologies': {
      post: {
        tags: ['Tecnologias (Technologies)'],
        summary: 'Criar tecnologia',
        description: 'Cadastra uma nova tecnologia no catálogo com nome único.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTechnologyDTO' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Tecnologia criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TechnologyResponse' },
              },
            },
          },
          '400': {
            description: 'Dados de entrada inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '409': {
            description: 'Tecnologia já existente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Tecnologias (Technologies)'],
        summary: 'Listar tecnologias',
        description: 'Retorna a lista de todas as tecnologias cadastradas.',
        responses: {
          '200': {
            description: 'Lista de tecnologias',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TechnologyResponse' },
                },
              },
            },
          },
        },
      },
    },
    '/api/projects': {
      post: {
        tags: ['Projetos (Projects)'],
        summary: 'Criar projeto de portfólio',
        description: 'Cadastra um projeto vinculando-o a um perfil de desenvolvedor e tecnologias.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProjectDTO' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Projeto criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos ou URLs incorretas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '404': {
            description: 'Perfil ou tecnologia informada não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Projetos (Projects)'],
        summary: 'Buscar projetos com filtro e paginação',
        description:
          'Lista projetos de forma paginada com suporte opcional a filtragem por nome de tecnologia.',
        parameters: [
          {
            name: 'technology',
            in: 'query',
            required: false,
            description: 'Filtrar projetos pela tecnologia (ex: TypeScript, React)',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            description: 'Número da página (padrão: 1)',
            schema: { type: 'integer', default: 1, minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Quantidade de itens por página (padrão: 10, máx: 100)',
            schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          '200': {
            description: 'Lista paginada de projetos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedProjectsResponse' },
              },
            },
          },
          '400': {
            description: 'Parâmetros de paginação inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
        },
      },
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projetos (Projects)'],
        summary: 'Buscar projeto por ID',
        description: 'Retorna os detalhes completos do projeto, perfil, tecnologias e avaliações.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Projeto encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
          '404': {
            description: 'Projeto não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/projects/{id}/upvote': {
      put: {
        tags: ['Projetos (Projects)'],
        summary: 'Incrementar curtidas/upvotes do projeto',
        description: 'Incrementa em +1 o contador de estrelas/curtidas do projeto indicado.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Projeto atualizado com a nova contagem de upvotes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
          '404': {
            description: 'Projeto não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/projects/{id}/feedbacks': {
      post: {
        tags: ['Feedbacks (Avaliações)'],
        summary: 'Cadastrar feedback para o projeto',
        description:
          'Cadastra uma avaliação técnica (nota de 1 a 5 e comentário) e recalcula e atualiza automaticamente a nota média do projeto.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateFeedbackDTO' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Feedback registrado e nota média do projeto recalculada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FeedbackResponse' },
              },
            },
          },
          '400': {
            description: 'Nota inválida (fora do intervalo de 1 a 5) ou campos vazios',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '404': {
            description: 'Projeto associado não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Feedbacks (Avaliações)'],
        summary: 'Listar feedbacks de um projeto',
        description: 'Retorna todas as avaliações técnicas cadastradas para o projeto.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de feedbacks',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/FeedbackResponse' },
                },
              },
            },
          },
          '404': {
            description: 'Projeto não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateProfileDTO: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Elias Cunha', maxLength: 100 },
          email: { type: 'string', format: 'email', example: 'elias.cunha@devshowcase.com' },
          bio: {
            type: 'string',
            example: 'Engenheiro de Software apaixonado por TypeScript e microsserviços.',
            maxLength: 500,
          },
        },
      },
      ProfileResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string' },
          bio: { type: 'string', nullable: true },
          projects: { type: 'array', items: { type: 'object' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTechnologyDTO: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'TypeScript', maxLength: 50 },
        },
      },
      TechnologyResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProjectDTO: {
        type: 'object',
        required: ['title', 'repositoryUrl', 'profileId'],
        properties: {
          title: { type: 'string', example: 'DevShowcase REST API Service', maxLength: 150 },
          description: {
            type: 'string',
            example: 'API RESTful para catálogo de projetos e vitrine de desenvolvedores.',
            maxLength: 2000,
          },
          repositoryUrl: {
            type: 'string',
            format: 'uri',
            example: 'https://github.com/EliaJunior/devshowcase-serivce',
          },
          profileId: { type: 'string', format: 'uuid' },
          technologyIds: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
          },
        },
      },
      ProjectResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          repositoryUrl: { type: 'string' },
          upvotes: { type: 'integer', example: 15 },
          averageRating: { type: 'number', format: 'float', example: 4.8 },
          profileId: { type: 'string', format: 'uuid' },
          profile: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
          technologies: {
            type: 'array',
            items: { $ref: '#/components/schemas/TechnologyResponse' },
          },
          feedbacks: {
            type: 'array',
            items: { $ref: '#/components/schemas/FeedbackResponse' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PaginatedProjectsResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProjectResponse' },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              total: { type: 'integer', example: 25 },
              totalPages: { type: 'integer', example: 3 },
            },
          },
        },
      },
      CreateFeedbackDTO: {
        type: 'object',
        required: ['authorName', 'comment', 'rating'],
        properties: {
          authorName: { type: 'string', example: 'Carlos Tech Lead', maxLength: 100 },
          comment: {
            type: 'string',
            example: 'Excelente separação de camadas e testes automatizados.',
            maxLength: 1000,
          },
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 5,
            description: 'Nota de avaliação de 1 a 5',
          },
        },
      },
      FeedbackResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' },
          authorName: { type: 'string' },
          comment: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Dados de entrada inválidos' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'rating' },
                message: { type: 'string', example: 'A nota deve ser no máximo 5' },
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Projeto não encontrado' },
        },
      },
    },
  },
};
